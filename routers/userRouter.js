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


const getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const profile = await Profile.findOne({ userId }).select('bio interests');
        if (!profile) return res.status(404).send('Profile not found.');

        return res.status(200).send(profile);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        return res.status(500).send('An error occurred while retrieving the profile.');
    }
};


router.route('/profile')
    .post(authorize,newUser)
router.get('/profile/:id', authorize, getUserProfile);

module.exports=router;