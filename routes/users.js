const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.get('/', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) res.status(401).send({ error: err });

			User.find({})
				.then(result => {
					if(result.length)
						res.status(200).json({ 
							users: result,
							authData
						})
					else
						res.status(404).json({
							message: 'There are no users'
						});
				})
				.catch(next)
		}
	)

})

// Sign up
router.post('/', (req, res, next) => {
	const body = req.body;
	User.create(body)
		.then(result => {
			if(result)
				res.status(201).json({
					message: 'sign up completed',
					user: result
				})
			else
				next({
					message: "Can't create user",
					name: 'Invalid'
				})
		})
		.catch(next);
})

// Login
router.post('/login', (req, res, next) => {
	const body = req.body;

	if(!body.username || !body.password) return next({
		message: 'Username or password are missing',
		name: 'Invalid'
	})
	User.findOne({ username: body.username })
		.then(result => {
			if(result){
				result.comparePass(body.password, function(err, isMatch) {
					if(err) throw(err);
					if(isMatch)
						jwt.sign(
							{ result },
							'secretKey',
							{ expiresIn: '2h' },
							(err, accessToken) => {
								if(err) next({
									message: "Invalid operation",
									name: 'Forbidden'
								});
								res.status(200).json({ accessToken });
							}
						)
					else
						res.status(401).json({
							message: 'Username or password are incorrect',
							name: 'Forbidden'
						})
				})

			}
			else
				next({
					status: 401,
					message: 'Username or password are incorrect',
					name: 'Forbidden'
				})
		})
		.catch(next);
})

// Authorization
function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization']
	if (!bearerHeader) return next({})
	let token = bearerHeader.split(' ');

	if(token && token[1]) {
		req.token = token[1];
		next();
	} else {
		next({
			status: 401,
			message: 'Invalid token',
			name: 'Forbidden'
		})
	}
}

module.exports = router;