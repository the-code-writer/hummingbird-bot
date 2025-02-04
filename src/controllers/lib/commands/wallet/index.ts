'use strict';

import { Logger } from 'sitka';
import * as dotenv from 'dotenv';
import { Keypair } from '@solana/web3.js';
import * as bip39 from "bip39";
import bs58 from 'bs58';

/*
import {
	generateKeyPair,
	signBytes,
	verifySignature,
	getUtf8Encoder,
	getBase58Decoder,
} from "@solana/web3.js";
*/

dotenv.config()

export class WalletCommand {
	/* Private Instance Fields */

	private _logger: Logger;

	/* Constructor */

	constructor() {
		this._logger = Logger.getLogger({ name: this.constructor.name });
		this._logger.debug('Wallet command initialized');
	}

	/* Public Instance Methods */

	public create(params: string[]): string {

		// create a new wallet
		this._logger.debug('Creating new wallet');


		// Generate a new keypair
		const keypair = Keypair.generate();

		// Convert the secret key to a base58 encoded string
		const privateKey = bs58.encode(keypair.secretKey);

		// Get the public key
		const publicKey = keypair.publicKey.toString();

		// Generate a mnemonic phrase (normally 12 or 24 words, here we'll just use 2 for the demonstration)
		const mnemonic = bip39.generateMnemonic();
		const words = mnemonic.toString().split(' ');
		const mnemonicPhrase = words.slice(0, 12).join(' ');

		console.log("Private Key:", privateKey);
		console.log("Public Key:", publicKey);
		console.log("Mnemonic Phrase (2 words):", mnemonicPhrase);

		const result: string = `
			Private Key: ${privateKey}\n
			Public Key: ${publicKey}\n
			"Mnemonic: ${mnemonicPhrase}\n

			`

		return result;
	}

	public recover(params: string[]): string {

		const mnemonic = params.join(' ');

		// arguments: (mnemonic, password)
		const seed = bip39.mnemonicToSeedSync(mnemonic, '');
		const keypair = Keypair.fromSeed(seed.slice(0, 32));
		const publicKey = keypair.publicKey.toBase58();

		console.log(`${publicKey}`);


		return publicKey;
	}

	public  sign(msg: string[]): string {

		// watch a wallet
/*
		const keys = await generateKeyPair();
		const message = getUtf8Encoder().encode(msg);
		const signedBytes = await signBytes(keys.privateKey, message);

		const decoded = getBase58Decoder().decode(signedBytes);
		console.log("Signature:", decoded);

		const verified = await verifySignature(keys.publicKey, signedBytes, message);
		console.log("Verified:", verified);

		return String(decoded);

		*/

		return '';
	}

	public watch(params: string[]): string {

		// watch a wallet

		return params.join(' ');
	}

}

export default WalletCommand;
