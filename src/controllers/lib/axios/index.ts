'use strict';

import axios from 'axios'
import { Logger } from 'sitka';
import * as dotenv from 'dotenv';

dotenv.config()

const telegramToken: string = process.env.TELEGRAM_TOKEN || '';

export class AxiosInstance {
	/* Private Instance Fields */

	private _logger: Logger;

	// Define the wallet addresses to monitor
	private _baseURL: string = '';
	private _token: string = '';
	/* Constructor */

	constructor() {
		this._logger = Logger.getLogger({ name: this.constructor.name });
	}

	/* Public Instance Methods */

	public echo(param: string): string {
		this._logger.debug('Received: ' + param);
		return param;
	}

	public setToken(token: string): void {
		this._logger.debug('New TG Token: ' + token);
		this._token = token;
		this._baseURL = `https://api.telegram.org/bot${this._token}`;
	}

	public getRequest(method: string, params: any) {

		const baseURL = this._baseURL;

		this._logger.debug('GET: ' + method + ' | ' + JSON.stringify(params));

		return axios
			.get(`/${method}`, {
				baseURL,
				params,
			});
		
	}

	public postRequest(method: string, data: any) {

		const baseURL = this._baseURL;

		this._logger.debug('POST: ' + method + ' | ' + JSON.stringify(data));

		return axios({
			method: 'post',
			baseURL,
			url: `/${method}`,
			data,
		})

	}

}

const axiosInstance: AxiosInstance = new AxiosInstance();

axiosInstance.setToken(telegramToken);

export default axiosInstance;
