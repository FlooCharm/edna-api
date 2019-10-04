const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Creates model for Route
const UserSchema = new mongoose.Schema({
	name: {
		type: String
	},
	username: {
		type: String,
		lowercase: true,
		required: [true, 'is required'],
		match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
		index: { unique: true }
	},
	email: {
		type: String,
		required: [true, 'is required'],
		match: [/\S+@+\S.\S+/, 'is invalid'],
		index: { unique: true }
	},
	password: {
		type: String,
		required: [true, 'is required']
	}
})

UserSchema.pre('save', function(next) {
	let user = this;
	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, SALT_ROUNDS, (err, hash) => {
		if(err) return next(err);

		user.password = hash;
		next()
	})
})

UserSchema.methods.comparePass = function (testPass, callback) {
	let user = this;

	bcrypt.compare(testPass, user.password, function(err, isMatch) {
		if(err) return callback(err);

		callback(null, isMatch);
	})
}

module.exports = mongoose.model('users', UserSchema);