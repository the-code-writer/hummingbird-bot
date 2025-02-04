import { Request } from 'express';
import { handleMessageTG } from './Telegram';

const handler: any = async(req:Request) => {

	const { body } = req;

	if (body) {
		
		const messageObj = body.message;

		await handleMessageTG(messageObj);

	}

}

export { handler }