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

  describe('POST /users', function() {
    it('should create a new user with valid credentials', function() {
      let newUser = {
        displayName: 'tim',
        password: 'timmyturner',
        email: 'timmy@turner.com'
      };
      return chai
        .request(app)
        .post('/api/users/register')
        .send(newUser)
        .then(response => {
          expect(response).to.have.status(201);
          expect(response.body.id).to.not.eql(null);
        });
    });

    it('should return a 422 error when a field is missing', function() {
      let spy = chai.spy();
      let newUser = { displayName: 'tim', email: 'timmy@turner.com' };
      return chai
        .request(app)
        .post('/api/users/register')
        .send(newUser)
        .then(spy)
        .catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal(
            'Missing password in request body'
          );
        })
        .then(() => {
          expect(spy).to.have.not.been.called;
        });
    });

    it('should return a 422 error when a field is not a string', function() {
      let spy = chai.spy();
      let newUser = {
        displayName: 'tim',
        password: 1234456789,
        email: 'timmy@turner.com'
      };
      return chai
        .request(app)
        .post('/api/users/register')
        .send(newUser)
        .then(spy)
        .catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal(
            'password must be a string'
          );
        })
        .then(() => {
          expect(spy).to.have.not.been.called;
        });
    });

    it('should return a 422 error when a field has leading or trailing whitespace', function() {
      let spy = chai.spy();
      let newUser = {
        displayName: 'tim',
        password: ' 1234456789',
        email: 'timmy@turner.com'
      };
      return chai
        .request(app)
        .post('/api/users/register')
        .send(newUser)
        .then(spy)
        .catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal(
            'password must not have any leading or trailing whitespace'
          );
        })
        .then(() => {
          expect(spy).to.have.not.been.called;
        });
    });

    it('should return a 422 error when a username exists', function() {
      let spy = chai.spy();
      let newUser = {
        displayName: 'bobby',
        password: '1234456789',
        email: 'nielsen.dylan@gmail.com'
      };
      return chai
        .request(app)
        .post('/api/users/register')
        .send(newUser)
        .then(spy)
        .catch(err => {
          expect(err).to.have.status(400);
          expect(err.response.body.message).to.equal(
            'That email already exists'
          );
        })
        .then(() => {
          expect(spy).to.have.not.been.called;
        });
    });

    it('should return a 422 error when a username is too short', function() {
      let spy = chai.spy();
      let newUser = { email: '', password: '1234456789', displayName: 'timmy turner' };
      return chai
        .request(app)
        .post('/api/users/register')
        .send(newUser)
        .then(spy)
        .catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal(
            'email must be 5 characters or longer'
          );
        })
        .then(() => {
          expect(spy).to.have.not.been.called;
        });
    });

    it('should return a 422 error when a password is too short', function() {
      let spy = chai.spy();
      let newUser = { displayName: '1', password: '1234', email: 'timmy@turner.com' };
      return chai
        .request(app)
        .post('/api/users/register')
        .send(newUser)
        .then(spy)
        .catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal(
            'password must be 8 characters or longer'
          );
        })
        .then(() => {
          expect(spy).to.have.not.been.called;
        });
    });

    it('should return a 422 error when a password is too long', function() {
      let spy = chai.spy();
      let newUser = {
        displayName: '1',
        password:
          '1234kjdfhglkadjfhglksdjhfgklsdjfhgklsdjhfgkljsdfhglkjsdhfglksjhdfglksjdhfglkjsdhfgklsdjhfglakjshdf;sDJKF;KLAHDGKLJAHDFGLKJHDSFLKJDLKVJBALDBJVAUEHRVUHAELRIUHVAERLGHK',
        email: 'timmy@turner.com'
      };
      return chai
        .request(app)
        .post('/api/users/register')
        .send(newUser)
        .then(spy)
        .catch(err => {
          expect(err).to.have.status(422);
          expect(err.response.body.message).to.equal(
            'password must be 72 characters or smaller'
          );
        })
        .then(() => {
          expect(spy).to.have.not.been.called;
        });
    });
  });
});
