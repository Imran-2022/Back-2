const mongoose = require('mongoose');
const Joi = require('joi');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    bio: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200,
    },
    interests: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200,
    },
});

const validateProfile = (profile) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        bio: Joi.string().min(1).max(200).required(),
        interests: Joi.string().min(1).max(200).required(),
    });

    return schema.validate(profile);
};

module.exports.Profile = mongoose.model('Profile', profileSchema);
module.exports.validateProfile = validateProfile;
