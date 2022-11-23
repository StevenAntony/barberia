const router = require('express').Router();
const User = require('../models/User');
const crypto = require('crypto');
const passport = require('passport');

router.post('/register', async (req, res) => {

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    });
    try {
        const savedUser = await user.save();
        res.json({
            error: null,
            data: savedUser
        })
    } catch (error) {
        res.status(400).json({error})
    }
})

// router.post('/login', async (req, res) => {
//     try {
//         const hash = crypto.createHash('sha256', process.env.SECRET_HASH)
//                    .update(req.body.password)
//                    .digest('hex');
//         const user = await User.find({ Usuario: req.body.usuario, Password: hash }).exec();
//         console.log(req.session.cuenta);
//         if (user.length == 1) {
//             req.session.loggedin = true;
//             req.session.code = user[0]._id;
//             console.log(req.session);
//             res.redirect('/corte');
//         }else{
//             res.redirect(`/?login=false`);
//         }
//     } catch (error) {
//         res.redirect(`/?login=false`);
//     }
// })
router.get('/signin', (req, res) => {
    res.render("login", { nameApp: process.env.NAME_APP });
});


router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/home',
    failureRedirect: '/auth/signin',
    failureFlash: true
}));

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/auth/signin');
    });
});  

module.exports = router;