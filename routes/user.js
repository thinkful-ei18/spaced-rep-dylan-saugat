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

router.post('/register', (req, res, next) => {
  const { displayName, email, password } = req.body;
  const lengthValidation = {
    displayName: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    },
    email: {
      min: 5,
      max: 72
    }
  };

  const requiredFields = ['displayName', 'email', 'password'];

  const errorGenerator = function(message) {
    const err = new Error(message);
    err.status = 422;
    return err;
  };

  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = errorGenerator(`Missing ${missingField} in request body`);
    return next(err);
  }

  const nonStringField = requiredFields.find(
    field => typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    const err = errorGenerator(`${nonStringField} must be a string`);
    return next(err);
  }

  //I was working on setting up authentication in the front end. I had some issues with data not being posted to the endpoint and I was working on fixing that. It was mostly because the
  //boilerplate uses redux form and I was not doing so.

  const whiteSpace = requiredFields.find(
    field =>
      req.body[field][0] === ' ' ||
      req.body[field][req.body[field].length - 1] === ' '
  );

  if (whiteSpace) {
    const err = errorGenerator(
      `${whiteSpace} must not have any leading or trailing whitespace`
    );
    return next(err);
  }

  const tooShort = requiredFields.find(
    field => req.body[field].length < lengthValidation[field].min
  );
  const tooLong = requiredFields.find(
    field => req.body[field].length > lengthValidation[field].max
  );

  if (tooShort || tooLong) {
    const err = errorGenerator(
      tooShort
        ? `${tooShort} must be ${
            lengthValidation[tooShort].min
          } characters or longer`
        : `${tooLong} must be ${
            lengthValidation[tooLong].max
          } characters or smaller`
    );
    return next(err);
  }
  return User.hashPassword(password)
    .then(digest => {
      const newUser = { displayName, email, password: digest };
      return User.create(newUser);
    })
    .then(response => {
      if (response) {
        res
          .status(201)
          .location(`${req.originalUrl}/${response.id}`)
          .json(response);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('That email already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;