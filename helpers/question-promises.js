'use strict';

const questions = require('../db/seed/questions');
const { Question } = require('../models/question');

function createQuestionPromises(userId) {
  let result = [];
  questions.forEach(element => {
    element.userId = userId;
    result.push(Question.create(element));
  });
  return result;
}

module.exports = createQuestionPromises;

