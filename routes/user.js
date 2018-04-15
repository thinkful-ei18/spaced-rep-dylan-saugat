'use strict';

const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

router.get('/', (req, res, next) => {
  User.find()
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;