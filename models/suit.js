const mongoose = require('mongoose');

// Creates model for Route
const SuitSchema = new mongoose.Schema({
	bearer: {
		type: mongoose.Schema.ObjectId,
		required: [true, 'is required'],
		ref: 'superheroes'
	},
	bearer_type: {
		type: Number,
		min: 0,
		max: 4,
		required: [true, 'is required']
	},
	fabric: {
		type: Number,
		min: 0,
		max: 2,
		required: [true, 'is required']
	},
	main_colors: {
		type: Array,
		validate: {
			validator: (arr) => arr.length <= 4,
			message: "You can't have more than four colors"
		}
	},
	thumbnail: String,
	measures: {
		length_left_arm: { type: Number, min: 0 },
		length_right_arm: { type: Number, min: 0 },
		width_left_arm: { type: Number, min: 0 },
		width_right_arm: { type: Number, min: 0 },
		length_left_leg: { type: Number, min: 0 },
		length_right_leg: { type: Number, min: 0 },
		width_left_leg: { type: Number, min: 0 },
		width_right_leg: { type: Number, min: 0 },
		neck: { type: Number, min: 0 },
		chest: { type: Number, min: 0 },
		waist: { type: Number, min: 0 },
		hips: { type: Number, min: 0 },
		torso: { type: Number, min: 0 },
		head: { type: Number, min: 0 }
	},
	pieces: {
		left_arm: {
			color: String,
			is_active: Boolean
		},
		right_arm: {
			color: String,
			is_active: Boolean
		},
		left_leg: {
			color: String,
			is_active: Boolean
		},
		right_leg: {
			color: String,
			is_active: Boolean
		},
		torso: {
			color: String,
			is_active: Boolean
		},
		neck: {
			color: String,
			is_active: Boolean
		},
		belt: {
			color: String,
			is_active: Boolean
		},
		left_foot: {
			color: String,
			is_active: Boolean
		},
		right_foot: {
			color: String,
			is_active: Boolean
		},
		mask: {
			color: String,
			is_active: Boolean
		},
		underwear: {
			color: String,
			is_active: Boolean
		}
	}
})

module.exports = mongoose.model('suits', SuitSchema);