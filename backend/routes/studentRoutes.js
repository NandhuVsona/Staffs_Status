const express = require('express')
const singup = require('../controllers/authController')
const router = express.Router()

router.post('/signup',singup)

module.exports = router