const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const JWT_SECRET = "HemantakaFirefist"

// ROUTE1 : Create a new user using POST "api/auth/signup". No login required.
router.post('/signup', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must contain atleast 5 characters').isLength({ min: 5}),
    body('contact', 'Contact number must contain atleast 10 digits').isLength({ min: 10, max:10}),
], async (req, res) => {
    // Return bad request and errors if found any
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // res.send(req.body)
    // Check whether the user with this email already exists
    try {
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success,error: "Sorry a user with this email already exists" })
        }
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
            contact: req.body.contact,
            address : req.body.address,
            city : req.body.city,
            state : req.body.state,
            pincode : req.body.pincode,
            country : req.body.country,
            companyName : req.body.companyName,
            occupation: req.body.occupation,
            experience: req.body.experience,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        console.log(data);
        success = true
        res.json({success, authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE2 : Authenticate  a user using POST "api/auth/login". No login required.
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials." })
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success,error: "Please try to login with correct credentials." })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        console.log(data);
        success = true
        res.json({success, authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 3 : Get logged in user details using POST : "/api/auth/getuser". Login required
router.get('/getuser',fetchUser, [
    body('email', 'Enter a valid email').isEmail(),


], async (req, res) => {
    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router