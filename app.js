const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const superheroesRouter = require('./routes/superheroes');
const suitsRouter = require('./routes/suits');

mongoose.connect('mongodb://127.0.0.1:27017/ednaDB');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/superheroes', superheroesRouter);
app.use('/suits', suitsRouter);

app.use((error, req, res, next) => {
	if(error) {
		res.status(500).json({
			message: error.message,
			type: error.name
		})
	}
})

module.exports = app;