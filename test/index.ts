'use strict';

import { expect } from 'chai';
import { WalletWatcher } from '../dist/index';

describe('WalletWatcher class', () => {
	it('should create an instance using its constructor', () => {
		const example: WalletWatcher = new WalletWatcher();
		expect(example, 'example should exist').to.exist;
	});
	it('should return whatever is passed to exampleMethod()', () => {
		const example: WalletWatcher = new WalletWatcher();
		const param = 'This is my param.';
		const returnValue: string = example.echo(param);
		expect(returnValue).to.equal(param, 'returns the value passed as a parameter');
	});
});
