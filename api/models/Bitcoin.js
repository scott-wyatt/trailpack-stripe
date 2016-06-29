'use strict'

const Model = require('trails-model')

/**
 * @module Bitcoin
 * @description Bitcoin Stripe Model
 */
module.exports = class Bitcoin extends Model {

  static config (app) {
    let config = {}

    if (app && app.config.database.orm === 'waterline') {
      config = {
        /**
         * Callback to be run before validating from Stripe.
         *
         * @param {Object}   values
         * @param {Function} next
         */
        beforeValidate: (values, next) => {
          if (values.created) {
            values.created = new Date(values.created * 1000)
          }
          next()
        }
      }
    }
    else if (app && app.config.database.orm === 'sequelize') {
      config = {
        //More informations about supported models options here : http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
        options: {
          hooks: {
            beforeValidate: (values, options, fn) => {
              if (values.created) {
                values.created = new Date(values.created * 1000)
              }
              fn()
            }
          },
          classMethods: {
            //If you need associations, put them here
            associate: (models) => {
              //More information about associations here : http://docs.sequelizejs.com/en/latest/docs/associations/
              // models.Bitcoin.belongsTo(models.Customer, {
              //   as: 'customer',
              //   onDelete: 'CASCADE',
              //   foreignKey: {
              //     allowNull: false
              //   }
              // })
            }
          }
        }
      }
    }
    return config
  }

  static schema (app, Sequelize) {
    let schema = {}
    if (app.config.database.orm === 'waterline') {
      schema = {
        id: {
          type: 'string', //"btcrcv_5zu4MpDCIGkHcC",
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"bitcoin_receiver"
        },
        created: {
          type: 'datetime' //1428165432
        },
        livemode: {
          type: 'boolean' //false
        },
        active: {
          type: 'boolean' //false
        },
        amount: {
          type: 'integer' //100
        },
        amount_received: {
          type: 'integer' //0
        },
        bitcoin_amount: {
          type: 'integer' //1428165432
        },
        bitcoin_amount_received: {
          type: 'integer' //0
        },
        bitcoin_uri: {
          type: 'string' //"bitcoin:test_7i9Fo4b5wXcUAuoVBFrc7nc9HDxD1?amount=0.01757908"
        },
        currency: {
          type: 'string' //"usd"
        },
        filled: {
          type: 'boolean' //false
        },
        inbound_address: {
          type: 'string' //"test_7i9Fo4b5wXcUAuoVBFrc7nc9HDxD1"
        },
        uncaptured_funds: {
          type: 'boolean' //false
        },
        description: {
          type: 'string' //"Receiver for John Doe"
        },
        email: {
          type: 'email' // "test@example.com"
        },
        metadata: {
          type: 'json' //{}
        },
        refund_address: {
          type: 'boolean' //false
        },
        transactions: {
          type: 'json'
        },
        payment: {
          type: 'string' //null
        },
        customer: {
          model: 'Customer'
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: 'datetime'
        }
      }
    }
    else if (app.config.database.orm === 'sequelize') {

      const database = app.config.database

      let sJSON = (field) =>{
        return {
          type: Sequelize.STRING,
          get: function() {
            return JSON.parse(this.getDataValue(field))
          },
          set: function(val) {
            return this.setDataValue(field, JSON.stringify(val))
          }
        }
      }

      if (database.models[this.constructor.name.toLowerCase()]) {
        if (database.stores[database.models[this.constructor.name.toLowerCase()].store].dialect == 'postgres') {
          sJSON = (field) => {
            return {
              type: Sequelize.JSON
            }
          }
        }
      }
      else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
        sJSON = (field) => {
          return {
            type: Sequelize.JSON
          }
        }
      }

      schema = {
        id: {
          type: Sequelize.STRING, //"btcrcv_5zu4MpDCIGkHcC",
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"bitcoin_receiver"
        },
        created: {
          type: Sequelize.DATE //1428165432
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        active: {
          type: Sequelize.BOOLEAN //false
        },
        amount: {
          type: Sequelize.INTEGER //100
        },
        amount_received: {
          type: Sequelize.INTEGER //0
        },
        bitcoin_amount: {
          type: Sequelize.INTEGER //1428165432
        },
        bitcoin_amount_received: {
          type: Sequelize.INTEGER //0
        },
        bitcoin_uri: {
          type: Sequelize.STRING //"bitcoin:test_7i9Fo4b5wXcUAuoVBFrc7nc9HDxD1?amount=0.01757908"
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        filled: {
          type: Sequelize.BOOLEAN //false
        },
        inbound_address: {
          type: Sequelize.STRING //"test_7i9Fo4b5wXcUAuoVBFrc7nc9HDxD1"
        },
        uncaptured_funds: {
          type: Sequelize.BOOLEAN //false
        },
        description: {
          type: Sequelize.STRING //"Receiver for John Doe"
        },
        email: {
          type: Sequelize.STRING, // "test@example.com"
          validate: {
            isEmail: true
          }
        },
        metadata: sJSON('metadata'), //{}
        refund_address: {
          type: Sequelize.BOOLEAN //false
        },
        transactions: sJSON('transactions'),
        payment: {
          type: Sequelize.STRING //null
        },

        // customer Model belongsTo
        customer: {
          type: Sequelize.STRING //null
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }

  // Stripe Webhook bitcoin.receiver.created
  stripeBitcoinReceiverCreated(bitcoin, cb) {
    const StripeService = this.app.services.StripeService
    const Bitcoin = this.app.models.Bitcoin
    StripeService.dbStripeEvent('Bitcoin', bitcoin, (err, uBitcoin) => {
      if (err) {
        return cb(err)
      }
      Bitcoin.afterStripeBitcoinReceiverCreated(uBitcoin, function(err, bitcoin){
        return cb(err, bitcoin)
      })
    })
  }

  afterStripeBitcoinReceiverCreated(bitcoin, next) {
    //Add somethings to do after a bitcoin receiver is created
    next(null, bitcoin)
  }

  // Stripe Webhook bitcoin.receiver.updated
  stripeBitcoinReceiverUpdated(bitcoin, cb) {
    const StripeService = this.app.services.StripeService
    const Bitcoin = this.app.models.Bitcoin
    StripeService.dbStripeEvent('Bitcoin', bitcoin, (err, uBitcoin) => {
      if (err) {
        return cb(err)
      }
      Bitcoin.afterStripeBitcoinReceiverUpdated(uBitcoin, function(err, bitcoin){
        return cb(err, bitcoin)
      })
    })
  }

  afterStripeBitcoinReceiverUpdated(bitcoin, next) {
    //Add somethings to do after a bitcoin receiver is created
    next(null, bitcoin)
  }

  // Stripe Webhook bitcoin.receiver.filled
  stripeBitcoinReceiverFilled(bitcoin, cb) {
    const StripeService = this.app.services.StripeService
    const Bitcoin = this.app.models.Bitcoin
    StripeService.dbStripeEvent('Bitcoin', bitcoin, (err, uBitcoin) => {
      if (err) {
        return cb(err)
      }
      Bitcoin.afterStripeBitcoinReceiverFilled(uBitcoin, function(err, bitcoin){
        return cb(err, bitcoin)
      })
    })
  }

  afterStripeBitcoinReceiverFilled(bitcoin, next) {
    //Add somethings to do after a bitcoin receiver is created
    next(null, bitcoin)
  }

  // Stripe Webhook bitcoin.receiver.transaction.created
  stripeBitcoinReceiverTransactionCreated(bitcoin, cb) {
    const StripeService = this.app.services.StripeService
    const Bitcoin = this.app.models.Bitcoin
    StripeService.dbStripeEvent('Bitcoin', bitcoin, (err, uBitcoin) => {
      if (err) {
        return cb(err)
      }
      Bitcoin.afterStripeBitcoinReceiverTransactionCreated(uBitcoin, function(err, bitcoin){
        return cb(err, bitcoin)
      })
    })
  }

  afterStripeBitcoinReceiverTransactionCreated(bitcoin, next) {
    //Add somethings to do after a bitcoin transaction is created
    next(null, bitcoin)
  }
}
