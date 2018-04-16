'use strict';

const express = require('express');
const router = express.Router();
const { Question } = require('../models/question');
const passport = require('passport');

router.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

router.get('/', (req, res, next) => {
  Question.find({ userId: req.user.id })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  Question.findById(req.body.id)
    .then(response => {
      if(response.answer === req.body.answer) {
        res.json('Correct');
      } else {
        res.json('Incorrect');
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
