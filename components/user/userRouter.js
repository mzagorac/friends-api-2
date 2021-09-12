const router = require('express').Router();
const userController = require('./userController');
const { catchAsyncError } = require('../../lib/functionErrorHandler');

router.get('/users/:id', catchAsyncError(userController.getUsers));

module.exports = router;
