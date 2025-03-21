// Updated WASM loader to use SP1 zero-knowledge proofs
import init, { verify_game, init_panic_hook } from '../../wasm/pkg';

let wasmModule: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

// Define the structure of a verification result
export interface VerificationResult {
  verified: boolean;
  proofId: string;
  commitment: string;
  verificationTime: string;
  proofDetails: string;
}

export const loadWasmModule = async () => {
  if (wasmModule) return wasmModule;
  if (loadPromise) return loadPromise;

  isLoading = true;
  
  try {
    loadPromise = init().then(() => {
      init_panic_hook(); // Initialize panic hook for better error messages
      wasmModule = { verify_game };
      isLoading = false;
      console.log("WASM module with SP1 loaded successfully");
      return wasmModule;
    });

    return loadPromise;
  } catch (error) {
    console.error("Failed to load WASM module:", error);
    isLoading = false;
    throw error;
  }
};

export const verifyGameWithSP1 = async (gameData: any): Promise<VerificationResult> => {
  const wasm = await loadWasmModule();
  console.log("Generating SP1 zero-knowledge proof for game data...", gameData);
  
  try {
    // Call the Rust WASM function which now returns a Promise
    const result = await wasm.verify_game(gameData);
    console.log("SP1 proof generated successfully:", result);
    return result as VerificationResult;
  } catch (error) {
    console.error("SP1 proof generation failed:", error);
    throw error;
  }
};

// Just checking if this file exists