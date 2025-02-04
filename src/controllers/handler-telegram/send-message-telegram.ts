/* eslint-disable no-useless-escape */
import { TelegramWebhook } from '../webhook/receive-webhook'
import axiosInstance from '../lib/axios'

interface ResponseToTelegram {
  text: string
  body: TelegramWebhook
}

const sendResponseToUser = async ({ text, body }: ResponseToTelegram) => {
	
	const text_options: { [key: string]: any } = {
		parse_mode: 'Markdown',
		disable_notification: false,
		protect_content: true
	};
	
	if ('reply_parameters' in body.message) {
		//text_options['reply_parameters'] = body.message.reply_parameters; 
	}
	
	if ('reply_markup' in body.message) {
		text_options.reply_markup = body.message.reply_markup;
	}

	const message = {
		chat_id: body.message.chat.id,
		text,
		...text_options,
	} 

	try {

		return axiosInstance.postRequest('sendMessage', message);

	} catch (err) {

		console.log(err)

		return {
			message: err,
		}

	}
}

export default sendResponseToUser
