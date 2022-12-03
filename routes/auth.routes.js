const router = require("express").Router();
const bcrypt = require('bcryptjs');

const UserModel = require('../models/User.model')
const {authMiddleware} = require('../middlewares')

router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs')
})

router.get('/signin', (req, res) => {
    res.render('auth/signin.hbs')
})

router.post('/signup', (req, res) => {
    const {password, email, username} = req.body
    console.log(req.body)
    if (password == '' || email == '' || username == '') {
        return res.render('auth/signup.hbs', {
            msg: "Please enter all details"
        })
    }

    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/

    if(!passwordRegex.test(password) ){
        return res.render('auth/signup.hbs', {
            msg: "Please enter a password with min 8 characters, a uppercase, a lowercase, a special character & a number"
        })
    }

    // HW: validate email

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    UserModel.create({username, email, password: hash})
        .then(() => {
            res.redirect('/signin')
        })
        .catch((err) => {
            console.log('Signup error')
        });
})

router.post('/signin', (req, res) => {
    const {password, email} = req.body

    // Repeat validation logic

    UserModel.findOne({email})
        .then((result) => {
            if (result) {
                const hash = result.password
                if(bcrypt.compareSync(password, hash)) {
                    req.session.loggedInUser = result
                    req.app.locals.loggedIn = true;
                    res.redirect('/')
                }
                else {
                    res.render('auth/signin.hbs', {
                        msg: "Password not matching"
                    })
                }
            }
            else {
                res.render('auth/signin.hbs', {
                    msg: "Email not found!"
                })
            }
        })
        .catch((err) => {
            console.log('User find failed in signin', err)
        });
})


// protected route
router.get('/profile', authMiddleware,  (req, res) => {
    res.render('profile.hbs')
})

router.get('/logout', (req, res) => {
    req.app.locals.loggedIn = false;
    req.session.destroy();
    res.redirect('/signin')
})

module.exports = router;