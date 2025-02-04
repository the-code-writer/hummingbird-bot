import axiosInstance from './axios'

const sendMessageTG: any = (messageObj: any, messageText: string) => {
	return axiosInstance.get('sendMessage', {
		chat_id: messageObj.chat.id,
		text: messageText
	});
}

const handleMessageTG: any = (messageObj: any) => {

	const messageText: string = messageObj.text || '';

	if (messageText.charAt(0) === '/') {
		const command: string = messageText.substr(1);

		switch (command) {
		case 'start': {

			return sendMessageTG(messageObj,
				'Hello, welcome'
			)

			break;
		}

		default: {

			return sendMessageTG(messageObj,
				'invalid commando'
			)

			break;
		}
		}
	} else {

		return sendMessageTG(messageObj,
			messageText
		)

	}
}

export { sendMessageTG, handleMessageTG };