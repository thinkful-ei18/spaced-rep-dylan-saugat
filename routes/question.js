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
        // updatePositionRightAnswer(response, response.mValue + 1);
        res.json({feedback: 'Correct', attempts: response.attempts + 1, correctAttempts: response.correctAttempts + 1});
      } else {
        // updatePositionWrongAnswer(response)
        res.json({
          feedback: 'Incorrect',
          attempts: response.attempts + 1
        });
      }
    })

    .catch(err => {
      next(err);
    });
});

module.exports = router;
