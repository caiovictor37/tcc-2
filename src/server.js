const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')
const OktaJwtVerifier = require('@okta/jwt-verifier')

// @CAIO: Config IP
// const hostName = 'localhost'
const hostName = '187.1.90.150'

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oa1b3uwzxt0W2rU7357',
  issuer: 'https://dev-360836.okta.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'))
  }
  let parts = req.headers.authorization.trim().split(' ')
  let accessToken = parts.pop()
  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      }
      next()
    })
    .catch(next) // jwt did not verify!
})

// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './tcc2.sqlite'
})

// Define our Post model
// id, createdAt, and updatedAt are added by sequelize automatically
let Post = database.define('posts', {
  title: Sequelize.TEXT,
  body: Sequelize.TEXT
})

let Workday = database.define('workday', {
  name: Sequelize.TEXT,
  activity: Sequelize.TEXT,
  type: Sequelize.TEXT
})

// Initialize finale
finale.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Post model
let userResource = finale.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id']
})

let workdayResource = finale.resource({
  model: Workday,
  endpoints: ['/workday', '/workday/:id']
})

// Resets the database if force = true, and launches the express app on :15040
database
  .sync({ force: false })
  .then(() => {
    app.listen(15040, () => {
      console.log(`Listening to port ${hostName}:15040`)
    })
  })
