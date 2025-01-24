const express = require('express');
const { Profile, validateProfile } = require('../models/profile');
const authorize = require('../middlewares/authorize');

const router = express.Router();
const newUser = async(req,res)=>{
    const { error } = validateProfile(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { userId, bio, interests } = req.body;

    let profile = await Profile.findOne({ userId });
    if (profile) return res.status(400).send('Profile already exists for this user!');

    profile = new Profile({ userId, bio, interests });

    await profile.save();
    return res.status(201).send(profile);
}

router.route('/profile')
    .post(authorize,newUser)

module.exports=router;