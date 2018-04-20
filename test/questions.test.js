'use strict';
const express = require('express');
const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');
const expect = chai.expect;
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
chai.use(chaiSpies);

const mongoose = require('mongoose');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const { User } = require('../models/user');
const seedUsers = require('../db/seed/users');

const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
describe('Before and After Hooks', function() {
  let token;
  before(function() {
    return mongoose.connect(TEST_DATABASE_URL, { autoIndex: false });
  });

  beforeEach(function() {
    return User.create(seedUsers)
      .then(() => User.find())
      .then(response => {
        response = response[0];
        token = jwt.sign(
          {
            user: {
              email: response.email,
              id: response.id
            }
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: response.email,
            expiresIn: '7d'
          }
        );
      });
  });

  afterEach(function() {
    sandbox.restore();
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('GET /questions', function() {
    it('should return the first question', function() {
      return chai
        .request(app)
        .get('/api/questions')
        .set('authorization', `Bearer ${token}`)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body.question).to.not.eql(null);
        });
    });

    it('should catch errors and respond properly', function() {
      const spy = chai.spy();
      sandbox.stub(express.response, 'json').throws('TypeError');
      return chai
        .request(app)
        .get('/api/questions')
        .set('authorization', `Bearer ${token}`)
        .then(spy)
        .catch(err => {
          expect(err).to.have.status(500);
        })
        .then(() => {
          expect(spy).to.not.have.been.called();
        });
    });
  });

  describe('POST /questions', function() {
    it('Should give correct feedback on the right answer', function() {
      let answer = { answer: 'Drog' };
      return chai
        .request(app)
        .post('/api/questions')
        .set('authorization', `Bearer ${token}`)
        .send(answer)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body.feedback).to.eql('Correct');
        });
    });

    it('Should give incorrect feedback on the wrong answer', function() {
      let answer = { answer: 'Dro' };
      return chai
        .request(app)
        .post('/api/questions')
        .set('authorization', `Bearer ${token}`)
        .send(answer)
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body.feedback).to.eql('Incorrect');
        });
    });
  });
});
