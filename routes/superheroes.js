const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Superhero = require('../models/superhero');
const jwt = require('jsonwebtoken');

// GET superheroes
router.get('/', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) res.status(401).send({ error: err });

			Superhero.find({}).populate('suits')
				.then(result => {
					if(result.length >= 0)
						res.status(200).json({ 
							superheroes: result
						})
					else
						res.status(404).json({
							message: 'There are no superheroes'
						});
				})
				.catch(next)
		}
	)
})

// INDEX superheroes
router.get('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) res.status(401).send({ error: err });

			Superhero.findById(req.params.id).populate('suits')
				.then(result => {
					if(result)
						res.status(200).json({
							superhero: result
						});
					else
						res.status(404).send('Superhero not found');
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
			if(err) res.status(401).send({ error: err });

			const body = req.body;
			Superhero.create(body)
				.then(result => {
					if(result)
						res.status(201).json({
							superhero: result
						});
					else
						res.status(404).send('Cant create superhero');
				})
				.catch(next)
		}
	)
})

// PUT superhero
router.put('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) res.status(401).send({ error: err });
			
			let body = req.body;
			Superhero.findByIdAndUpdate(req.params.id, req.body, { new: true })
				.then(result => {
					if(result)
						res.status(201).json({
							superhero: result
						});
					else
						res.status(404).send('Cant update, superhero is missing');
				})
				.catch(next)
		}
	)
})

// DELETE superhero
router.delete('/:id', verifyToken, function(req, res, next) {
	jwt.verify(
		req.token,
		'secretKey',
		(err, authData) => {
			if(err) res.status(401).send({ error: err });

			Superhero.findByIdAndRemove(req.params.id)
				.then(() => res.status(204).send() )
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