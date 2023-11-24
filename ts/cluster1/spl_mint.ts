import { Keypair, PublicKey, Connection, Commitment } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from '../wba-wallet.json';

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey('5QKezAmQRNK5gtbTyCG1Y2NULku1sKVTGStpswJwomJx');

(async () => {
  try {
    // Create an ATA
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    console.log(`Your ata is: ${ata.address.toBase58()}`);

    // Mint to ATA
    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair,
      token_decimals
    );
    console.log(`Your mint txid: ${mintTx}`);
    // Your ata is: 6DJhVT8P7ViUnkSkdoiatb9d7B8ixBk61F19E3occ3NN
    // Your mint txid: 222YSwk2sqYG9zSDiCNiXksZazsU1git9y5wsz5uv9okbwZWMeo35wk12bmr6PguxBPJvgqJqbbaZsmmSCsYdQk5
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
