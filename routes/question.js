'use strict';

const express = require('express');
const router = express.Router();
const { Question } = require('../models/question');
const passport = require('passport');

router.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

router.get('/', (req, res, next) => {
  console.log(req.user);
  Question.find()
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;
