const express = require('express');
const {
    messageController,
    chatController,
} = require('../../controller');
const router = express.Router();

router
    .route('/')
    .post(chatController.accessChat)
    .get(chatController.fetchChats)

router
    .route('/send/:chatId')
    .get(messageController.allMessages);

router
    .route('/send')
    .post(messageController.sendMessage);

module.exports = router;

