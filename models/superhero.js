const mongoose = require('mongoose');

// Creates model for Route
const SuperheroSchema = new mongoose.Schema({
	super_name: {
		type: String,
		required: [true, 'is required'],
		index: { unique: true }
	},
	weather: {
		type: String,
		required: [true, 'is required']
	},
	element: {
		type: Number,
		required: [true, 'is required']
	},
	superpowers: [String],
	suits: [{
		type: mongoose.Schema.ObjectId,
		ref: 'suits'
	}]
})

module.exports = mongoose.model('superheroes', SuperheroSchema);


// https://stackoverflow.com/questions/8737082/mongoose-schema-within-schema