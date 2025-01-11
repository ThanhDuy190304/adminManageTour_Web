const express = require('express');
const router = express.Router();
const userController = require('../modules/user/userController')
const userService = require('../modules/user/userService')

router.get('/handle', async (req, res) => {
    try {
        const users = await userService.filterUsers();
        return users.json();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});