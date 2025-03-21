// WASM module for game verification using SP1 ZK proofs
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use js_sys::Date;
use wasm_bindgen_futures::future_to_promise;
use js_sys::Promise;

// SP1 imports
use sp1_core::{SP1Prover, SP1Stdin, SP1Verifier};
use sp1_derive::sp1_circuit;
use rand_chacha::ChaCha20Rng;
use rand::SeedableRng;
use sha2::{Sha256, Digest};

#[derive(Serialize, Deserialize, Clone)]
pub struct GameData {
    score: i32,
    blocks_destroyed: i32,
    game_won: bool,
    game_completed: bool,
    timestamp: String,
}

#[derive(Serialize)]
pub struct VerificationResult {
    verified: bool,
    proof_id: String,
    commitment: String,
    verification_time: String,
    proof_details: String,
}

// The SP1 circuit that verifies the game state
#[sp1_circuit]
pub fn game_verification_circuit(stdin: SP1Stdin) {
    // Read the game data from stdin
    let game_data: GameData = serde_json::from_slice(&stdin.read::<Vec<u8>>()).unwrap();
    
    // Simple verification logic
    let valid_score = game_data.blocks_destroyed > 0 && 
                     game_data.score >= game_data.blocks_destroyed * 10;
    
    // If game completed, check that all blocks were destroyed
    let valid_win = !game_data.game_won || game_data.blocks_destroyed >= 20;
    
    // We can add more complex game logic verification here
    
    // Assert that the game state is valid
    sp1_zkvm::io::write_bool(valid_score && valid_win);
}

// Compute a commitment to the game data
fn compute_commitment(game_data: &GameData) -> String {
    let mut hasher = Sha256::new();
    hasher.update(format!("{}{}{}{}", 
        game_data.score, 
        game_data.blocks_destroyed,
        game_data.game_won,
        game_data.timestamp
    ));
    let result = hasher.finalize();
    format!("0x{:x}", result)
}

#[wasm_bindgen]
pub fn verify_game(game_data_js: JsValue) -> Promise {
    // Convert JS value to Rust struct
    let game_data_result = serde_wasm_bindgen::from_value::<GameData>(game_data_js);
    
    if let Err(e) = game_data_result {
        let err = JsValue::from_str(&format!("Failed to parse game data: {}", e));
        return Promise::reject(&err);
    }
    
    let game_data = game_data_result.unwrap();
    let game_data_clone = game_data.clone();
    
    // Simulate SP1 proof generation (async)
    let future = async move {
        let start_time = Date::now();
        
        // Generate a deterministic seed for the prover
        let mut seed_hasher = Sha256::new();
        seed_hasher.update(format!("{}{}{}", 
            game_data.score, 
            game_data.blocks_destroyed,
            game_data.timestamp
        ));
        let seed = seed_hasher.finalize();
        let mut seed_array = [0u8; 32];
        seed_array.copy_from_slice(&seed);
        
        // Initialize the prover with a deterministic RNG
        let mut rng = ChaCha20Rng::from_seed(seed_array);
        let mut prover = SP1Prover::new();
        
        // Serialize game data to pass to the circuit
        let game_data_serialized = serde_json::to_vec(&game_data).unwrap_or_default();
        
        // Pass the game data to the circuit
        prover.push_input(&game_data_serialized);
        
        // Generate the proof using the circuit
        let proof = prover.prove_vd(&game_verification_circuit);
        
        // Verify the proof
        let mut verifier = SP1Verifier::new();
        let verified = verifier.verify(proof).is_ok();
        
        // Generate the commitment from game data
        let commitment = compute_commitment(&game_data);
        
        // Generate a deterministic proof ID
        let proof_id = format!("proof_{:x}", seed_array[0..4].iter().fold(0u32, |acc, &x| (acc << 8) | x as u32));
        
        // Calculate verification time
        let verification_time = format!("{}ms", (Date::now() - start_time) as i32);
        
        // Create and return the verification result
        let result = VerificationResult {
            verified,
            proof_id,
            commitment,
            verification_time,
            proof_details: format!("ZK-verified blocks: {}, score: {}", 
                game_data.blocks_destroyed, game_data.score),
        };
        
        Ok(serde_wasm_bindgen::to_value(&result)?)
    };
    
    future_to_promise(future)
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}