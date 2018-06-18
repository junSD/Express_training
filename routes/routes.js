'use strict';

var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.get('/users', userController.getAllUsers);
// router.get('/usersrefresh', userController.getAllUsersRefresh);
router.post('/users', userController.addNewUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/', userController.editUser);

module.exports = router;
