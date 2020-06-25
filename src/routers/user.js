const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { welcomeMail, exitMail } = require('../emails/account')
const router = express.Router()

// Creating a User
router.post('/users', async(req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        welcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Getting all Users
router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})


// Update User 
router.patch('/users/me', auth, async(req, res) => {

    // Check is right updates are given
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isAllowed = updates.every(update => allowedUpdates.includes(update))

    if (!isAllowed) {
        return res.status(400).send('Invalid Request')
    }

    // Updates if right set of fileds given
    try {
        // Perform updates
        updates.forEach((update) => {
                req.user[update] = req.body[update]
            })
            // Saving user
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Delete User
router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        exitMail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


// User login
router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


// User logout
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send('Logout Success!')
    } catch (e) {
        res.status(500).send()
    }
})


// Logout All Sessions
router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send('Logout All Session Success!')
    } catch (e) {
        res.status(500).send()
    }
})


// Uploading images

// Multer Setting
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file of the following extensions. (jpg, jpeg, or png)'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


// Delete Photo

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
})


// Get Photo
router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error('Not found!')
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send(e)
    }
})




module.exports = router