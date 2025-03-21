# Crypto Breakout

A retro Breakout-style arcade game powered by WebAssembly and SP1 zero-knowledge proofs.

![Crypto Breakout Game]

## 🎮 Game Overview

Crypto Breakout combines classic arcade gameplay with modern cryptographic technology:

- A nostalgic Breakout/Arkanoid game with a crypto twist
- Break blocks to score points and generate proofs
- Use SP1 zero-knowledge proofs to verify your gameplay achievements
- Experience the intersection of gaming and blockchain technology

## 🚀 Key Features

- **Blockchain-Ready**: Generate zero-knowledge proofs that could be submitted to blockchain networks
- **WebAssembly Integration**: Near-native performance with Rust compiled to WASM
- **SP1 Zero-Knowledge Proofs**: Verify game state without revealing gameplay details
- **Retro Aesthetic**: Mac OS-inspired UI with modern visuals
- **Multiple Levels**: Progress through increasingly difficult stages

## 🔧 Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Tailwind CSS, Shadcn UI
- **Game Engine**: Custom implementation with HTML Canvas
- **Cryptography**: WebAssembly, Rust, SP1 Zero-Knowledge Proofs

## 🧩 How SP1 and WebAssembly Are Implemented

### WebAssembly Integration

The game uses Rust code compiled to WebAssembly to enable high-performance cryptographic operations:

1. Rust code in `wasm/src/lib.rs` is compiled using `wasm-pack`
2. The WASM binary is loaded at game startup via `loadWasmModule()` in `src/lib/wasmLoader.ts`
3. This provides near-native performance for cryptographic operations and SP1 verification

### SP1 Zero-Knowledge Proof System

SP1 is used to generate and verify zero-knowledge proofs of gameplay achievements:

1. **Proof Generation**: When blocks are destroyed, the proof counter increases
2. **Verification Flow**:
   - Clicking "Verify with SP1" sends game state to the WASM module
   - The SP1 circuit in Rust verifies the score based on destroyed blocks
   - A cryptographic commitment is generated from the game state
   - The proof verifies gameplay legitimacy without revealing game details
3. **Blockchain Ready**: Proofs could potentially be submitted to a blockchain for on-chain verification

### Core Components

- **SP1 Circuit** (`game_verification_circuit`): Verifies game state validity
- **Proof Generator**: Creates zero-knowledge proofs from game data
- **Verification Terminal**: Displays proof details and verification results

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Rust and wasm-pack (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/0xbigbang/breakout-game
cd breakout-game

# Install dependencies
npm install

# Build WASM module (requires Rust and wasm-pack)
npm run wasm:build
```

### Running the Game

```bash
npm run dev
```

Visit `http://localhost:8080` (or the port shown in your terminal) to play the game.

### Game Controls

- **Move Paddle**: Left/Right arrow keys or A/D
- **Launch Crab**: Space bar or click "Launch Crab" button
- **Verify Gameplay**: Click "Verify with SP1" when proofs are available

## 🌐 Deployment

### Deploying on Netlify

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy using Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Initialize and deploy
   netlify init
   netlify deploy --prod
   ```

3. **Or via Netlify Web UI**
   - Go to [Netlify](https://app.netlify.com/)
   - Connect your repository
   - Set build command to `npm run build`
   - Set publish directory to `dist`

4. **Create a `netlify.toml` File**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

## 🧠 Technical Deep Dive

### SP1 Circuit Implementation

The SP1 circuit in `wasm/src/lib.rs` verifies game state with the following logic:

```rust
#[sp1_circuit]
pub fn game_verification_circuit(stdin: SP1Stdin) {
    // Read the game data from stdin
    let game_data: GameData = serde_json::from_slice(&stdin.read::<Vec<u8>>()).unwrap();
    
    // Simple verification logic
    let valid_score = game_data.blocks_destroyed > 0 && 
                     game_data.score >= game_data.blocks_destroyed * 10;
    
    // If game completed, check that all blocks were destroyed
    let valid_win = !game_data.game_won || game_data.blocks_destroyed >= 20;
    
    // Assert that the game state is valid
    sp1_zkvm::io::write_bool(valid_score && valid_win);
}
```

### Cryptographic Commitments

The game generates commitments to game state using SHA-256:

```rust
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
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Succint Labs for providing the zero-knowledge proof system (SP1)
- The Rust and WebAssembly communities


