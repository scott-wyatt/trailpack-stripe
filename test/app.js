'use strict'
const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')

const packs = [
  smokesignals.Trailpack,
  require('trailpack-core'),
  require('trailpack-router'),
  require('trailpack-express'),
  require('../') // trailpack-stripe
]

const ORM = process.env.ORM || 'sequelize'

const stores = {
  sqlitedev: {
    adapter: require('sails-disk')
  }
}

if (ORM === 'waterline') {
  packs.push(require('trailpack-waterline'))
}
else if (ORM === 'js-data') {
  packs.push(require('trailpack-js-data'))
  stores.sqlitedev = {
    database: 'dev',
    storage: './.tmp/dev.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}
else if (ORM === 'sequelize') {
  packs.push(require('trailpack-sequelize'))
  stores.sqlitedev = {
    database: 'dev',
    storage: './.tmp/dev.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}

const App = {
  pkg: {
    name: 'stripe-trailpack-test',
    version: '1.0.0'
  },
  api: {
    controllers: {
      DefaultController: class DefaultController extends require('trails-controller') {
        info(req, res){
          res.send('ok')
        }
      }
    }
  },
  config: {
    database: {
      stores: stores,
      models: {
        defaultStore: 'sqlitedev',
        migrate: 'drop'
      }
    },
    stripe: {
      public: 'test',
      secret: 'test',
      validate: 'false'
    },
    main: {
      packs: packs
    },
    routes: [{
      path: '/',
      method: ['GET'],
      handler: 'DefaultController.info'
    }],
    policies: {

    },
    web: {
      express: require('express'),
      middlewares: {
        order: [
          'addMethods',
          'cookieParser',
          'session',
          'bodyParser',
          'passportInit',
          'passportSession',
          'methodOverride',
          'router',
          'www',
          '404',
          '500'
        ]
      }
    }
  }
}
const dbPath = __dirname + '/../.tmp/sqlitedev.db'
if (fs.existsSync(dbPath))
  fs.unlinkSync(dbPath)

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
