'use strict';

import { Logger } from 'sitka';
import * as dotenv from 'dotenv';

dotenv.config();

const web3 = require('@solana/web3.js');

const raydiumProgramID: string = process.env.RAYDIUM_PROGRAM_ID || '';

class RaydiumTransactionWatcher {

	private _logger: Logger;

	public RAYDIUM_PROGRAM_ID:any;

	public TOKEN_MINT_ADDRESS:any;

	public connection:any;

	public subscriptionId:any;

    constructor(tokenMintAddress:string) {

        this.RAYDIUM_PROGRAM_ID = new web3.PublicKey(raydiumProgramID);
        this.TOKEN_MINT_ADDRESS = new web3.PublicKey(tokenMintAddress);
        this.connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'), 'confirmed');
        this.subscriptionId = null;
		this._logger = Logger.getLogger({ name: this.constructor.name });
		this._logger.debug('Raydium Transaction Watcher initialized');
    }

    async handleTransaction(transaction:any) {
        try {
            const parsedTransaction = await this.connection.getParsedTransaction(transaction);

            if (parsedTransaction) {
                const meta = parsedTransaction.meta;
                const message = parsedTransaction.transaction.message;

                // Filter for transactions involving Raydium's AMM program
                if (message.accountKeys.some((key:any) => key.pubkey.equals(this.RAYDIUM_PROGRAM_ID))) {
                    let tokenInvolved = false;
                    for (const instruction of message.instructions) {
                        if (instruction.accounts.some((account:any) => account.equals(this.TOKEN_MINT_ADDRESS))) {
                            tokenInvolved = true;
                            break;
                        }
                    }

                    if (tokenInvolved) {
                        console.log("Transaction Details:");
                        console.log("Amount Swapped:", meta.postTokenBalances[0]?.uiTokenAmount?.uiAmount || "N/A");
                        console.log("Tokens Involved:", meta.postTokenBalances.map((balance:any) => balance.mint));
                        console.log("Quantity:", meta.postTokenBalances[0]?.uiTokenAmount?.amount || "N/A");
                        console.log("Time:", new Date(parsedTransaction.blockTime * 1000).toISOString());
                    }
                }
            }
        } catch (error) {
            console.error("Error processing transaction:", error);
        }
    }

    async watchTransactions() {
        this.subscriptionId = await this.connection.onLogs(this.RAYDIUM_PROGRAM_ID, (logs:any, context:any) => {
			console.log('Context:', context);
            this.handleTransaction(logs.signature);
        }, 'confirmed');

        console.log('Subscribed to Raydium transactions. Subscription ID:', this.subscriptionId);
    }

    async stopWatching() {
        if (this.subscriptionId !== null) {
            await this.connection.removeOnLogsListener(this.subscriptionId);
            console.log('Stopped watching Raydium transactions.');
        }
    }
}

export default RaydiumTransactionWatcher;