const router = require('express').Router();
const { registerValidation, loginValidation, updateUserValidation } = require('../validation');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt =require('bcryptjs');
const verify = require('../verifyToken');

// BASE ROUTE: /user

router.post('/test', (req, res) => {
    console.log(req.body.name)
})

// @POST
// Params <BODY>: name, email, password
router.post('/register', async (req, res) => {
    // Validation
    const { error } = registerValidation(req.body);
    if(error) {
        return res.json({ message: error.details[0].message })
    }
    
    // Check for user
    const existingEmail = await User.findOne({ email: req.body.email });
    if(existingEmail) {
        return res.json({ message: 'Email alredy registered'});
    } 

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        // Save User
        user.save((err, user) => {
            res.json({user: user._id});
        });
    } catch(err) {
        console.log(err);
    }
});

// @POST
// Params <BODY>: email, password
router.post('/login', async (req, res) => {
    // Validation
    const { error } = loginValidation(req.body);
    if(error) {
        return res.json({ message: error.details[0].message });
    }

    // Check if email exists <<- Which mean check if user exists ->>
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return res.json({ message: 'User does not exist' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) {
        return res.json({ message: 'Invalid Password' });
    }

    // Create and assign token
    const token = jwt.sign({ _id: user._id }, 'foryoureyezonly');

    res.header('auth-token', token).json({ user: { name: user.name } });
});

// @POST
// Params <BODY>: name, password, new password
// <Header>: req.user
router.put('/updateUser', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    // Validation
    const { error } = updateUserValidation(req.body);
    if(error) {
        return res.json({ message: error.details[0].message });
    }

    // Check if password is valid
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.json({ message: 'Password entered is wrong' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    // Update user
    User.updateOne({ _id: req.user._id }, { name: req.body.name, password: hashedPassword }, (err) => {
        if(err) {
            return res.json({ message: 'Could not update user' })
        } else {
            return res.json({ message: 'User updated succesfuly', password: req.body.newPassword })
        }
    });
})

module.exports = router;