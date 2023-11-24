import wallet from '../wba-wallet.json';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from '@metaplex-foundation/umi';

// Define our Mint address
const mint = publicKey('5QKezAmQRNK5gtbTyCG1Y2NULku1sKVTGStpswJwomJx');

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint: mint,
      mintAuthority: signer,
    };

    let data: DataV2Args = {
      name: 'WBA Token',
      symbol: 'WBAT',
      uri: '',
      sellerFeeBasisPoints: 0,
      collection: null,
      creators: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data: data,
      isMutable: true,
      collectionDetails: null,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });
    let result = await tx
      .sendAndConfirm(umi)
      .then((r) => r.signature.toString());
    console.log(result);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
