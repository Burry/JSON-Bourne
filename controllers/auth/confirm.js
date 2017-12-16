const async = require('async');
const _ = require('lodash');
const router = require('express').Router();
const passport = require('passport');
const User = require('../../models').sql.User;

const render = (req, res, locals) => res.render('auth/confirm', locals || {
        title: 'Confirm Account',
        section: 'session',
        form: req.body,
        returnto: req.query.returnto,
        authUser: req.session.auth,
        existingUser: req.user || null
    });

// Function to check if a user already exists for this profile id or email (and sign them in)
const checkExisting = (req, res, next) => {
    if (res.locals.existingUser) return checkAuth(req, res);
    User.findOne({
        $or: [
            {fbProfileId: res.locals.authUser.fbProfileId},
            {email: res.locals.authUser.email}
        ]
    }).then(user => {
        res.locals.existingUser = user;
        return passport.authenticate('facebook', {
            successRedirect: req.cookies.target || '/',
            failureRedirect: '/join'
        });
    }).catch(err => next({ message: 'Sorry, there was an error processing your information. Please try again.' }));
}

// Function to handle data confirmation process
const checkAuth = (req, res) => {
    async.series([

        // Create or update user
        function(next) {
            if (res.locals.existingUser) {
                console.info('[auth.confirm] - Existing user found, updating...');

                res.locals.existingUser.set({
                    fbProfileId: res.locals.authUser.fbProfileId,
                    fbAvatar: res.locals.authUser.fbAvatar,
                    fbAccessToken: res.locals.authUser.fbAccessToken,
                    fbRefreshToken: res.locals.authUser.fbRefreshToken
                });

                User.update(res.locals.existingUser, {where: {email: res.locals.existingUser.email}})
                    .then(() => next)
                    .catch(err => next({ message: 'Sorry, there was an error processing your account. Please try again.' }));
            } else {
                console.info('[auth.confirm] - Creating new user...');
                User.create({
                    firstName: res.locals.form.firstName,
                    lastName: res.locals.form.lastName,
                    email: res.locals.form.email,
                    password: Math.random().toString(36).slice(-8),
                    fbProfileId: res.locals.authUser.fbProfileId,
                    fbAvatar: res.locals.authUser.fbAvatar,
                    fbAccessToken: res.locals.authUser.fbAccessToken,
                    fbRefreshToken: res.locals.authUser.fbRefreshToken
                }).then(user => {
                    res.locals.existingUser = user;
                    next();
                })
                .catch(err => next({ message: 'Sorry, there was an error processing your account. Please try again.' }));
            }
        },

        // Session
        function() {
            if (req.user) {
                console.info('[auth.confirm] - Already signed in, skipping sign in.')
                return res.redirect(req.cookies.target || '/')
            }
            return passport.authenticate('facebook', {
                successRedirect: req.cookies.target || '/',
                failureRedirect: '/join'
            })(req, res, () => {});
        }

    ], function(err) {
        if (err) {
            console.info('[auth.confirm] - Issue signing user in.', err)
            // req.flash('error', err.message || 'Sorry, there was an issue signing you in. Please try again.')
            return res.redirect('/sign-in')
        }
    })
}

// GET /auth/confirm
router.get('/', (req, res) => !req.session.auth
    ? res.redirect('/sign-in')
    : checkExisting(req, res, render(req, res))
);

// POST /auth/confirm
router.post('/', (req, res) => {
    if (!res.locals.form.firstName || !res.locals.form.lastName || !res.locals.form.email) {
        // req.flash('error', 'Please enter a name & email.')
        // return next()
        // THROW ERROR
    }
    return checkAuth(req, res);
});

exports = module.exports = router;
