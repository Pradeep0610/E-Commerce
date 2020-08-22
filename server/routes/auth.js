const router = require('express').Router()
const User = require('../models/user')
const verifyToken = require('../middlewares/verify-token')

const jwt = require('jsonwebtoken')

//Signup Route
router.post('/auth/signup', async (req, res) => {
    console.log('I am hit')
    if (!req.body.email || !req.body.password) {
        res.json({
            success: false,
            message: "Please provide email or password"
        })
    } else {
        try {
            let newUser = new User()
            newUser.name = req.body.name
            newUser.email = req.body.email
            newUser.password = req.body.password
            await newUser.save()
            let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
                expiresIn: 604800  // 1 week
            })

            res.json({
                success: true,
                token: token,
                message: "Successfully created new user"
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
})

//Profile Route
router.get('/auth/user', verifyToken, async (req, res) => {
    try {
        let foundUser = await User.findOne({ _id: req.decoded._id }).populate("address")

        if (foundUser) {
            res.json({
                success: true,
                user: foundUser
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router