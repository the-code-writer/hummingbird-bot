/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Router } from 'express'

import webhook from './webhook'
import test from './test'
import user from './user'

const router: Router = express.Router()
const date = new Date().toISOString()

// Define routes
router.get('/', healthCheck);

function healthCheck(req:any, res:any) {
	req.log.info(`Route: Health Check Passed : ${date}`)
	return res
		.status(200)
		.send('<html> <head><style>body{font-family:\'arial\'; text-align:center; margin-top: 64px}</style></head><body><h1>TELEGRAM SERVER 1.0.0</h1><p><strong><a href=\'./v1\'>Open Version 1 APIs</a></strong></p></body></html>');
	
}


// Only for test route
router.use('/test', test)

// Only for test route
router.use('/user', user)

// Use in local test for set telegram webhook
router.use('/webhook', webhook)

export default router
