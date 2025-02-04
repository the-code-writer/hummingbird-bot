import { TelegramWebhook } from '../webhook/receive-webhook'
import helpMessage from './messages/help'
import startMessage from './messages/start'
import testMessage from './messages/test'
import commandWallet from './messages/wallet'
import sendResponseToUser from './send-message-telegram'

const verifyMessage = async (body: TelegramWebhook) => {

	let response: string = '';

	let paramsArray: string[] = [];

	const message = body.message.text

	const regex = /^\/(?<command>\w+)(?:\s+(?<action>\w+))?(?:\s+(?<params>[\w\s]+))?$/;

	const match = message.match(regex);

	if (match && match.groups) {

		const { command, action, params } = match.groups;

		if (params) {
			paramsArray = params.split(/\s+/);
		}

		switch (command) {

			case 'start': {
				response = startMessage(body.message.from.first_name);
				body.message.reply_parameters = {
					message_id: body.message.chat.id
				};
				body.message.reply_markup = {
					inline_keyboard:
						[
							[
								{ text: 'Option 1', callback_data: 'option1' },
								{ text: 'Option 2', callback_data: 'option2' }
							]
						]
				};
				break;
			}

			case 'help': {
				response = helpMessage();
				break;
			}

			case 'test': {
				response = testMessage();
				break;
			}

			case 'echo': {
				response = action + ' ' + paramsArray.join(' ');
				break;
			}

			case 'ping': {
				response = 'pong!';
				break;
			}

			case 'wallet': {
				response = commandWallet(action, paramsArray);
				break;
			}

			default: {
				response = `Unknown command [ ${command} ]. Please use /help to look up available list of commands.`
				break;
			}

		}

	} else {

		response = 'The input does not match the expected format. Please use /help to look up available list of commands.'

		console.log(response);

	}

	const messagePayload: any = {
		text: response,
		body
	};

	console.log("MESSAGE PAYLOAD", [body.message])

	await sendResponseToUser(messagePayload)

	return {
		message: 'OK',
	}

}

export default verifyMessage
