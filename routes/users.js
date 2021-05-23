const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const jwt = require("jsonwebtoken");
require('dotenv').config();

router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res) => {
        res.json({ message: 'Signup successful' });
    });

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = { _id: user._id, email: user.email };
                            const accessToken = jwt.sign({ body }, process.env.ACCESS_TOKEN_SECRET);
                            return res.header("Authorization", accessToken).send("bearer " + accessToken);
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);


router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const results = await User.find({}, "_id email");
        res.status(200).json(results);
    } catch (err) {
        res.status(400).json({ error: "invalid request" });
    }
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;