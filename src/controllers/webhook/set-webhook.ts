import { Request, Response } from 'express'
import axiosInstance from '../lib/axios';

const setWebhook = (req: Request, res: Response) => {

	axiosInstance.postRequest('setWebhook', { url: req.params.url }).then((response) => {

			console.log('Webhook configured:', response.data)

			res.json({
				message: `'Webhook configured:' ${response.data}`,
			})
		})
		.catch((error) => {
			console.error('Error configuring webhook:', error.response.data)

			res.json({
				message: `Error configuring webhook:' ${error.response.data}`,
			})
		})
		
}

export default setWebhook
