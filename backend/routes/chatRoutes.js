const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const { createNotification } = require('../utils/notifications');

// Get all chats for the authenticated user or owner
router.get('/', auth, async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [{ user: req.user.id }, { owner: req.user.id }]
        })
            .populate('hostel', 'name')
            .populate('user', 'name email')
            .populate('owner', 'name email')
            .populate('messages.sender', 'name')
            .lean();
        res.json(chats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post(
    '/',
    [
        auth,
        check('hostelId', 'Hostel ID is required').isMongoId(),
        check('message', 'Message content is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { hostelId, message } = req.body;

        try {
            const hostel = await Hostel.findById(hostelId).populate('owner');
            if (!hostel) {
                return res.status(404).json({ message: 'Hostel not found' });
            }

            let chat = await Chat.findOne({
                hostel: hostelId,
                user: req.user.id,
                owner: hostel.owner._id
            });

            const newMessage = {
                sender: req.user.id,
                content: message
            };

            if (chat) {
                chat.messages.push(newMessage);
                await chat.save();
            } else {
                chat = new Chat({
                    hostel: hostelId,
                    user: req.user.id,
                    owner: hostel.owner._id,
                    messages: [newMessage]
                });
                await chat.save();
            }

            // Create notification for the owner
            await createNotification(
                hostel.owner._id,
                'message',
                '💬 New Message Received',
                `You have a new message about ${hostel.name}`,
                { hostelId: hostelId }
            );

            res.status(201).json(chat);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

// Reply to an existing chat
router.post(
    '/:chatId/message',
    [
        auth,
        check('message', 'Message content is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { message } = req.body;

        try {
            const chat = await Chat.findById(req.params.chatId).populate('hostel', 'name').populate('owner', 'name').populate('user', 'name');
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            if (chat.owner._id.toString() !== req.user.id && chat.user._id.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            chat.messages.push({
                sender: req.user.id,
                content: message
            });

            await chat.save();

            // Create notification for the recipient (if sender is user, notify owner; if sender is owner, notify user)
            const recipientId = chat.owner._id.toString() === req.user.id ? chat.user._id : chat.owner._id;
            const isOwnerSending = chat.owner._id.toString() === req.user.id;
            
            await createNotification(
                recipientId,
                'message',
                '💬 New Message Reply',
                isOwnerSending 
                    ? `${chat.owner.name} replied to your message about ${chat.hostel.name}`
                    : `${chat.user.name} sent a new message about ${chat.hostel.name}`,
                { hostelId: chat.hostel._id }
            );

            res.json(chat);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

module.exports = router;