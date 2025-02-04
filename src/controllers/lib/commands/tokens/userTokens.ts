'use strict';

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import * as SPLToken from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";
import { Logger } from 'sitka';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = new Connection("https://api.mainnet-beta.solana.com");

class UserTokenccounts {

    private _logger: Logger;

    private _userPublicKey: string;

    constructor(userPublicKey: string) {
        this._userPublicKey = userPublicKey;
        this._logger = Logger.getLogger({ name: this.constructor.name });
        this._logger.debug('User Tokens initialized');

    }

    public async getTokens() {

        // 1. you can fetch all token account by an owner
        let response = await connection.getTokenAccountsByOwner(
            new PublicKey(this._userPublicKey), // owner here
            {
                programId: TOKEN_PROGRAM_ID,
            }
        );

        const userTokens: any = {};

        response.value.forEach(async (e) => {

            const accountInfo = SPLToken.AccountLayout.decode(e.account.data);
            const publicKey: string = `${new PublicKey(accountInfo.mint)}`;
            const mintAddress: string = `${new PublicKey(accountInfo.mint)}`;
            const amount: number = parseFloat(`${accountInfo.amount}`) / 6;

            const metaplex = Metaplex.make(connection);

    let tokenName;
    let tokenSymbol;
    let tokenLogo;

    /*
    
    const metadataAccount = true;
    
    metaplex
        .nfts()
        .pdas()
        .metadata({ mint: new PublicKey(mintAddress) });

    const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);
    */

    if (true) {
          const token = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress)  });
          //console.log('YES token', token)
          tokenName = token.name;
          tokenSymbol = token.symbol;
          if(typeof token === 'object' && token.jsonLoaded && 'json' in token){
            const tokenJson:any = token.json;
            if(typeof token === 'object' && 'json' in token){
                tokenLogo = tokenJson.image;
            }
          }
    }else{
        console.log('NO token')
    }

            
            const tokenMetadata = { publicKey, mintAddress, tokenName, tokenSymbol, tokenLogo, amount }

            console.log('tokenMetadata\n=============================================', tokenMetadata)

            userTokens[mintAddress] = tokenMetadata;

        });

        console.log(userTokens);

    }
}

export default UserTokenccounts;