
import { WalletCommand } from "../../../lib/commands";
import UserTokenccounts from "../../../lib/commands/tokens/userTokens";
import RaydiumTransactionWatcher from "../../../lib/commands/tokens/watcher";



const walletCommand: WalletCommand = new WalletCommand();

const userTokens: UserTokenccounts = new UserTokenccounts('AtFdfLicnzE8PhruwmW8W1Q9twvbcZ4rQzeZDZE2XKQv');

const commandWallet = (action: string, params: string[]) => {

	let responseText: string = '';

	switch (action) {

		case 'create': {

			responseText = walletCommand.create(params);

			break;
		}

		case 'recover': {

			responseText = walletCommand.recover(params);

			break;
		}

		case 'sign': {

			responseText = walletCommand.sign(params);

			break;
		}

		case 'tokens': {

			responseText = 'Calculating ...';
			
			userTokens.getTokens();

			break;
		}

		case 'watch': {

			const watcher = new RaydiumTransactionWatcher("Gc91piZmjjXTc8oAro9bo1y4eUgGrVH1aqvTUpashGRR");
			watcher.watchTransactions();

			responseText = walletCommand.watch(params);

			break;
		}

		default: {

			responseText = `Invalid action ${action}`;

			break;

		}

	}

	return responseText;

}

export default commandWallet
