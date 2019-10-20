const mongoose = require('mongoose');

// Creates model for Route
const SuitSchema = new mongoose.Schema({
	bearer: {
		type: mongoose.Schema.ObjectId,
		required: [true, 'is required'],
		ref: 'superheroes'
	},
	fabric: {
		type: Number,
		required: [true, 'is required']
	},
	main_colors: {
		type: Array,
		validate: {
			validator: (arr) => arr.length <= 4,
			message: "You can't have more than four colors"
		}
	},
	measures: {
		length_left_arm: Number,
		length_right_arm: Number,
		width_left_arm: Number,
		width_right_arm: Number,
		length_left_leg: Number,
		length_right_leg: Number,
		width_left_leg: Number,
		width_right_leg: Number,
		neck: Number,
		chest: Number,
		waist: Number,
		hips: Number,
		torso: Number,
		head: Number
	},
	pieces: {
		left_arm: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		right_arm: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		left_leg: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		right_leg: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		torso: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		neck: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		belt: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		left_foot: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		right_foot: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		mask: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		hat: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		},
		accesories: {
			color: String,
			isActive: Boolean,
			isAvailable: Boolean
		}
	}
})

module.exports = mongoose.model('suits', SuitSchema);