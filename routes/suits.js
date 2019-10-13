const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Suit = require('../models/suit');
const Superhero = require('../models/superhero');
const jwt = require('jsonwebtoken');

// GET suits
router.get('/', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			Suit.find({}).populate('bearer')
				.then(result => {
					if(result.length)
						res.status(200).json({ 
							suits: result
						})
					else
						res.status(404).json({
							message: 'There are no suits'
						});
				})
				.catch(next)
		}
	)
})

// GET suits by superhero
router.get('/superhero/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			Superhero.findById(req.params.id).populate('suits')
				.then(result => {
					if(result)
						res.status(200).json({
							suits: result.suits
						});
					else
						res.status(404).send('There are no suits');
				})
				.catch(next)
		}
	)
})

// INDEX suits
router.get('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			Suit.findById(req.params.id).populate('bearer')
				.then(result => {
					if(result)
						res.status(200).json({
							suit: result
						});
					else
						res.status(404).send('Suit not found');
				})
				.catch(next)
		}
	)
})

// POST superhero
router.post('/', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			const body = req.body;
			Suit.create(body)
				.then(result => {
					if(result)
						res.status(201).json({
							suit: result
						});
					else
						res.status(404).send('Cant create suit');
				})
				.catch(next)
		}
	)
})

// PUT superhero
router.put('/:id', function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			let body = req.body;
			Suit.findByIdAndUpdate(req.params.id, req.body, { new: true })
				.then(result => {
					if(result)
						res.status(201).json({
							suit: result
						});
					else
						res.status(404).send('Cant update, suit is missing');
				})
				.catch(next)
		}
	)
})

// DELETE superhero
router.delete('/:id', function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) next(err);

			Suit.findByIdAndRemove(req.params.id)
				.then(() => res.status(204).send() )
				.catch(next)
		}
	)
});

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