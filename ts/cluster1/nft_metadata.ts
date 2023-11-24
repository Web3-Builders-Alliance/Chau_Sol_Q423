import wallet from '../wba-wallet.json';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from '@metaplex-foundation/umi';
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image =
      'https://arweave.net/kQ5HL8_bqSJ2KhGLEcmrJMuYq5QmQ_q42iWa7qrO4Ow';
    const metadata = {
      name: 'Generug Trekn',
      symbol: 'GNT',
      description: 'A generug that allow user can travel',
      image: image,
      attributes: [
        {
          trait_type: 'Location',
          value: 'Ha noi',
        },
        {
          trait_type: 'Rarity',
          value: 'Rare',
        },
      ],
      properties: {
        files: [
          {
            type: 'image/png',
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const myUri = await bundlrUploader.uploadJson(metadata);
    console.log('Your image URI: ', myUri);
    // https://arweave.net/Z9cF8ctoqIvpWCqKKhNIXjaYRlfYDYuxhaNxk1t3Sf0
  } catch (error) {
    console.log('Oops.. Something went wrong', error);
  }
})();
