import express from 'express'
const router = express.Router()
import { addMessage, addOwnerMessage, getMessage, getOwnerMessage } from '../controllers/messageControllers.js'


router.post('/get-message',getMessage)
router.post('/sent-messageToOwner',addMessage)
router.post('/get-Ownermessage',getOwnerMessage)
router.post('/sent-messageToUser',addOwnerMessage)

export default router 