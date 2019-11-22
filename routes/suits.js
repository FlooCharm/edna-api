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
			if(err) res.status(401).send({ error: err });

			Suit.find({}).populate('bearer', '_id super_name')
				.then(result => {
					if(result.length >= 0)
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
			if(err) res.status(401).send({ error: err });

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
			if(err) res.status(401).send({ error: err });

			Suit.findById(req.params.id).populate('bearer', '_id super_name')
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

// POST suit
router.post('/', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) res.status(401).send({ error: err });

			const body = req.body;
			Suit.create(body)
				.then(result => {
					if(result){
						Superhero.findByIdAndUpdate(result.bearer, {$push: {suits: result._id}}, { new: true })
							.then(() => {
								res.status(201).json({
									suit: result
								});
							})
							.catch(next)
					}
					else
						res.status(404).send('Cant create suit');
				})
				.catch(next)
		}
	)
})

// PUT suit
router.put('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) res.status(401).send({ error: err });

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

// DELETE suit
router.delete('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) res.status(401).send({ error: err });

			Suit.findById(req.params.id)
				.then(suit => {
					Superhero.findByIdAndUpdate(suit.bearer, {$pullAll: {suits: [suit._id]}}, { new: true })
						.then(() => {
							suit.remove({ _id: req.params.id})
								.then(() => {
									res.status(204).send()
								})
						})
						.catch(next)

				})
				.catch(next)
		}
	)
});

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