'use strict';
const { User } = require('../models/user');
const { Question } = require('../models/question');

function updatePosition(response, newMValue) {
  User.findById(response.userId)
    .then(result => {
      let questions = result.questions;
      console.log(questions);
    });
}

module.exports = updatePosition;
