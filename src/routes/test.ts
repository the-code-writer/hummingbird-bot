import express, { Router } from 'express'
import setWebhook from '../controllers/webhook/set-webhook'
import receiveWebhook from '../controllers/webhook/receive-webhook'

const router:Router = express.Router()

router.get('/', setWebhook)
router.post('/', receiveWebhook)

export default router
