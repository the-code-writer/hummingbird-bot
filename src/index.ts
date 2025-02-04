'use strict';

import { Logger } from 'sitka';
import { Connection, PublicKey, ParsedTransactionWithMeta/*,  Commitment */ } from '@solana/web3.js';
import * as dotenv from 'dotenv';

dotenv.config();

// Raydium Liquidity Pool V4 contract address
const raydiumLiquidityPoolAddress: string = process.env.RAYDIUM_POOL_ADDRESS || '';

const raydiumLiquidityPool = new PublicKey(raydiumLiquidityPoolAddress);

const wssUrl: string = process.env.SOLANA_RPC_WSS_URL || '';

export class WalletWatcher {
	/* Private Instance Fields */

	private _logger: Logger;

	// Define the wallet addresses to monitor
	private _walletAddresses: PublicKey[] = [];

	private _addresses: string[] = [];

	private _wsolAmountInLamports: bigint;
	/* Constructor */

	constructor(wsol = 500) {
		this._logger = Logger.getLogger({ name: this.constructor.name });
		this._wsolAmountInLamports = BigInt(wsol * 1e9);
	}

	/* Public Instance Methods */

	public updateAddresses(): void {

		for (const address of this._addresses) {
			try {
				if (PublicKey.isOnCurve(new PublicKey(address))) {
					this._walletAddresses.push(new PublicKey(address));
					//this._logger.info(`Public key: ${address}`);
				} else {
					this._logger.error(`Public key ${address} is not on the curve`);
				}
			} catch (error) {
				this._logger.error(`Invalid public key : ${address}`);
				console.error(error);
			}
		}

	}

	public initAddresses(addresses: string[], wsol = 500, autoRun = false): void {

		this._addresses = addresses;

		this.updateAddresses();

		if (wsol > 0) {
			this._wsolAmountInLamports = BigInt(wsol * 1e9);
		}

		if (autoRun) {
			this.initApp();
		}

	}

	public initApp() {

		const connection = new Connection(wssUrl, 'confirmed');

		for (const wallet of this._walletAddresses) {
			const subscriptionId = connection.onSignatureWithOptions(
				'', // Empty string because we're not looking for a specific signature but any new one
				async (notification: any) => {

					console.log(notification);
					
					if (notification.err) {
						this._logger.debug(`Transaction failed for wallet ${wallet.toBase58()}`);
						return;
					}

					const transaction = await connection.getParsedTransaction(notification.signature, {
						maxSupportedTransactionVersion: 0,
					});

					if (!transaction || !transaction.transaction || !transaction.meta) {
						this._logger.debug('Transaction data not available.');
						return;
					}

					this.checkTransaction(transaction);
				},
				{ commitment: 'confirmed' }
			);

			this._logger.debug(`Listening for transactions on wallet: ${wallet.toBase58()}, subscriptionId: ${subscriptionId}`);
		}
	}

	public checkTransaction(transaction: ParsedTransactionWithMeta) {
		if (!transaction.meta || !transaction.transaction.message) return;

		const innerInstructions = transaction.meta.innerInstructions;

		for (const instruction of transaction.transaction.message.instructions) {
			if (instruction.programId.equals(raydiumLiquidityPool)) {
				for (const inner of innerInstructions || []) {
					if ('parsed' in inner && 'postBalances' in inner && 'preBalances' in inner) {
						// Now TypeScript knows these properties exist because of the type guard
						const postBalances: any = inner.postBalances;
						const preBalances: any = inner.preBalances;

						for (let i = 0; i < preBalances.length; i++) {
							if ((BigInt(preBalances[i]) - BigInt(postBalances[i])) > this._wsolAmountInLamports) {
								const accountKey = transaction.transaction.message.accountKeys[i];
								if (this._walletAddresses.some((w: { equals: (arg0: PublicKey) => any; }) => w.equals(accountKey.pubkey))) {
									this._logger.debug(`Wallet ${accountKey.pubkey.toBase58()} has swapped 500 WSOL on Raydium Pool.`);

									const tokenReceived = this.findReceivedToken(inner, accountKey.pubkey);

									if (tokenReceived) {
										this._logger.debug(`Received token: ${tokenReceived.mint.toBase58()} with amount: ${tokenReceived.amount}`);
									} else {
										this._logger.debug('No token received in this transaction or couldn\'t detect it.');
									}

									this._logger.debug(JSON.stringify(transaction, null, 2));
								}
							}
						}
					} else {
						this._logger.debug('This inner instruction does not contain the expected properties:', inner);
					}
				}
			}
		}
	}

	public findReceivedToken(inner: any, wallet: PublicKey): { mint: PublicKey; amount: bigint } | null {
		for (const innerInstruction of inner.instructions) {
			if (innerInstruction.programId.equals(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'))) { // SPL Token program
				const parsedInstruction = innerInstruction.parsed;
				if (parsedInstruction && parsedInstruction.type === 'transfer') {
					const { source, destination, amount } = parsedInstruction.info;
					this._logger.debug(source, destination, amount);
					if (destination === wallet.toBase58()) {
						return {
							mint: new PublicKey(parsedInstruction.info.mint),
							amount: BigInt(amount)
						};
					}
				}
			}
		}
		return null;
	}


	/* Public Instance Methods */

	public echo(param: string): string {
		this._logger.debug('Received: ' + param);
		return param;
	}

}

const walletWatcher: WalletWatcher = new WalletWatcher();

const addresses = [
	'BnhsbnNZfV7xi52M5PVe9spBsv4KR3Bt565sevuojrhd',
	'yoWtM8Jq1Ub1YuqztZwGSk12JgUSAuDnUT8w7scAnjd',
	'7SN85aNBMhWUVR7ktzRda4MUjY41VGnxSHznhbcqQVtb'
];

walletWatcher.initAddresses(addresses, 100, true);
