const express = require('express');
const { Profile, validateProfile } = require('../models/profile');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// Function to create a new user profile
const newUser = async(req, res) => {
    // Validate the request body to ensure it meets the profile schema
    const { error } = validateProfile(req.body);
    if (error) return res.status(400).send(error.details[0].message);  // Return error if validation fails

    const { userId, bio, interests } = req.body;

    // Check if a profile already exists for the given userId
    let profile = await Profile.findOne({ userId });
    if (profile) return res.status(400).send('Profile already exists for this user!');  // Return error if profile exists

    // Create a new profile if it doesn't exist
    profile = new Profile({ userId, bio, interests });

    // Save the profile to the database
    await profile.save();
    return res.status(201).send(profile);  // Return success response with the newly created profile
};

// Function to get a user profile by userId
const getUserProfile = async (req, res) => {
    const userId = req.params.id;  // Get the userId from the URL parameter

    try {
        // Find the profile based on the userId and select only 'bio' and 'interests' fields
        const profile = await Profile.findOne({ userId }).select('bio interests');
        if (!profile) return res.status(404).send('Profile not found.');  // Return error if profile doesn't exist

        return res.status(200).send(profile);  // Return success response with the found profile
    } catch (err) {
        console.error('Error fetching profile:', err.message);  // Log error for debugging
        return res.status(500).send('An error occurred while retrieving the profile.');  // Return server error response
    }
};

// Define routes for handling profile-related requests
router.route('/profile')
    .post(authorize, newUser);  // POST to create a new profile (requires authorization)
router.get('/profile/:id', getUserProfile);  // GET to fetch a profile by userId (requires authorization)

module.exports = router;  // Export the router to be used in other parts of the application
