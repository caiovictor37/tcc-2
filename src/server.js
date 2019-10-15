const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')
const OktaJwtVerifier = require('@okta/jwt-verifier')

// @CAIO: Config IP
const hostName = 'localhost'
// const hostName = '187.1.90.150'

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oa1b3uwzxt0W2rU7357',
  issuer: 'https://dev-360836.okta.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// Verifica o Middleware do JWT token
app.use((req, res, next) => {
  // Sempre requisita um cabeçalho de autorização a cada requisição de dados
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
    .catch(next) // Caso onde JWT não foi validado
})

// Criação do banco SQLite
let database = new Sequelize({
  dialect: 'sqlite',
  storage: './tcc2.sqlite'
})

// Criação das tabelas de banco de dados, seguindo os objetos do Diagrama de Classes
// id, createdAt, e updatedAt são adicionados automaticamente
let Workstation = database.define('workstation', {
  name: Sequelize.TEXT,
  description: Sequelize.TEXT,
  workdayStart: Sequelize.TIME,
  workdayEnd: Sequelize.TIME
})

let Worker = database.define('worker', {
  name: Sequelize.TEXT,
  description: Sequelize.TEXT,
  registrationCode: Sequelize.STRING
})

let Activity = database.define('activity', {
  name: Sequelize.TEXT,
  description: Sequelize.TEXT,
  type: Sequelize.TEXT
})

let Workday = database.define('workday', {
  workstationId: Sequelize.INTEGER,
  workerId: Sequelize.INTEGER,
  activityId: Sequelize.INTEGER
})

// Initializa finale
finale.initialize({
  app: app,
  sequelize: database
})

// Cria um REST dinâmico para todas as requisições
let workstationResource = finale.resource({
  model: Workstation,
  endpoints: ['/workstation', '/workstation/:id']
})

let workerResource = finale.resource({
  model: Worker,
  endpoints: ['/worker', '/worker/:id']
})

let activityResource = finale.resource({
  model: Activity,
  endpoints: ['/activity', '/activity/:id']
})

let workdayResource = finale.resource({
  model: Workday,
  endpoints: ['/workday', '/workday/:id']
})

// Reseta o banco de dados se force = true, e sobe uma aplicação backend na porta :15040
database
  .sync({ force: false })
  .then(() => {
    app.listen(15040, () => {
      console.log(`Listening to port ${hostName}:15040`)
    })
  })
