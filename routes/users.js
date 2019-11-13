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
			if(err) next(err);

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
// router.post('/', (req, res, next) => {
// 	const body = req.body;
// 	User.create(body)
// 		.then(result => {
// 			if(result)
// 				res.status(201).json({
// 					message: 'sign up completed',
// 					user: result
// 				})
// 			else
// 				next({
// 					message: "Can't create user",
// 					name: 'Invalid'
// 				})
// 		})
// 		.catch(next);
// })

router.post('/', (req, res, next) => {
	const body = req.body;
	res.status(201).json({
		message: 'sign up completed',
		user: body
	})
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
							{ expiresIn: '30s' },
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
					message: 'Username or password are incorrect',
					name: 'Forbidden'
				})
		})
		.catch(next);
})

// Authorization
function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization']
	let token = bearerHeader.split(' ');

	if(token && token[1]) {
		req.token = token[1];
		next();
	} else {
		next({
			message: 'Invalid token',
			name: 'Forbidden'
		})
	}
}

module.exports = router;