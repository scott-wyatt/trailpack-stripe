'use strict'

const Model = require('trails-model')

/**
 * @module Transfer
 * @description Transfer Stripe Model
 */
module.exports = class Transfer extends Model {

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
          type: 'string', //"tr_xxxxxxxxxxxx"
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"transfer"
        },
        created: {
          type: 'datetime' //1393986746
        },
        date: {
          type: 'datetime' //1393986746
        },
        livemode: {
          type: 'boolean' //false
        },
        amount: {
          type: 'integer' //90800
        },
        currency: {
          type: 'string' //"usd"
        },
        reversed: {
          type: 'boolean' //false
        },
        status: {
          type: 'string' //"paid"
        },
        type: {
          type: 'string' //"bank_account"
        },
        reversals: {
          type: 'json' //{"object": "list","total_count": 0,"has_more": false,"url": "/v1/transfers/tr_3biGAn1hq8iKfo/reversals","data": []},
        },
        balance_transaction: {
          type: 'string' //"txn_2v2VcOoVgfuxzP"
        },
        bank_account: {
          type: 'json' //{"object": "bank_account","id": "ba_0LK9sazX8tPl54","last4": "3532","country": "US","currency": "usd","status": "new","fingerprint": "AMyAAyMWZEg1LDfU","routing_number": "322271627","bank_name": "J.P. MORGAN CHASE BANK, N.A.","default_for_currency": true},
        },
        destination: {
          type: 'string' //"ba_0LK9sazX8tPl54"
        },
        description: {
          type: 'string' //"STRIPE TRANSFER"
        },
        failure_message: {
          type: 'string' //null
        },
        failure_code: {
          type: 'string' //null
        },
        amount_reversed: {
          type: 'integer'//0
        },
        metadata: {
          type: 'json' //{}
        },
        statement_descriptor: {
          type: 'string' //null
        },
        recipient: {
          type: 'string' //null
        },
        source_transaction: {
          type: 'string' //null
        },
        application_fee: {
          type: 'string' //null
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
          type: Sequelize.STRING, //"tr_xxxxxxxxxxxx"
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"transfer"
        },
        created: {
          type: Sequelize.DATE //1393986746
        },
        date: {
          type: Sequelize.DATE //1393986746
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        amount: {
          type: Sequelize.INTEGER //90800
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        reversed: {
          type: Sequelize.BOOLEAN //false
        },
        status: {
          type: Sequelize.STRING //"paid"
        },
        type: {
          type: Sequelize.STRING //"bank_account"
        },
        reversals: sJSON('reversals'),
        balance_transaction: {
          type: Sequelize.STRING //"txn_2v2VcOoVgfuxzP"
        },
        bank_account: sJSON('bank_account'),
        destination: {
          type: Sequelize.STRING //"ba_0LK9sazX8tPl54"
        },
        description: {
          type: Sequelize.STRING //"STRIPE TRANSFER"
        },
        failure_message: {
          type: Sequelize.STRING //null
        },
        failure_code: {
          type: Sequelize.STRING //null
        },
        amount_reversed: {
          type: Sequelize.INTEGER //0
        },
        metadata: sJSON('metadata'),
        statement_descriptor: {
          type: Sequelize.STRING //null
        },
        recipient: {
          type: Sequelize.STRING //null
        },
        source_transaction: {
          type: Sequelize.STRING //null
        },
        application_fee: {
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

  // Stripe Webhook transfer.created
  stripeTransferCreated(transfer, cb) {
    const StripeService = this.app.services.StripeService
    const Transfer = this.app.models.Transfer
    StripeService.dbStripeEvent('Transfer', transfer, (err, uTransfer) => {
      if (err) {
        return cb(err)
      }
      Transfer.afterStripeTransferCreated(uTransfer,
        function(err, transfer){
          return cb(err, transfer)
        })
    })
  }

  afterStripeTransferCreated(transfer, next){
    //Do something after a transfer is created
    next(null, transfer)
  }

  // Stripe Webhook transfer.updated
  stripeTransferUpdated(transfer, cb) {
    const StripeService = this.app.services.StripeService
    const Transfer = this.app.models.Transfer
    StripeService.dbStripeEvent('Transfer', transfer, (err, uTransfer) => {
      if (err) {
        return cb(err)
      }
      Transfer.afterStripeTransferUpdated(uTransfer,
        function(err, transfer){
          return cb(err, transfer)
        })
    })
  }

  afterStripeTransferUpdated(transfer, next){
    //Do something after a transfer is updated
    next(null, transfer)
  }

  // Stripe Webhook transfer.reversed
  stripeTransferReversed(transfer, cb) {
    const StripeService = this.app.services.StripeService
    const Transfer = this.app.models.Transfer
    StripeService.dbStripeEvent('Transfer', transfer, (err, uTransfer) => {
      if (err) {
        return cb(err)
      }
      Transfer.afterStripeTransferReversed(uTransfer,
        function(err, transfer){
          return cb(err, transfer)
        })
    })
  }

  afterStripeTransferReversed(transfer, next){
    //Do something after a transfer is reversed
    next(null, transfer)
  }

  // Stripe Webhook transfer.paid
  stripeTransferPaid(transfer, cb) {
    const StripeService = this.app.services.StripeService
    const Transfer = this.app.models.Transfer
    StripeService.dbStripeEvent('Transfer', transfer, (err, uTransfer) => {
      if (err) {
        return cb(err)
      }
      Transfer.afterStripeTransferPaid(uTransfer,
        function(err, transfer){
          return cb(err, transfer)
        })
    })
  }

  afterStripeTransferPaid(transfer, next){
    //Do something after a transfer is paid
    next(null, transfer)
  }

  // Stripe Webhook transfer.failed
  stripeTransferFailed(transfer, cb) {
    const StripeService = this.app.services.StripeService
    const Transfer = this.app.models.Transfer
    StripeService.dbStripeEvent('Transfer', transfer, (err, uTransfer) => {
      if (err) {
        return cb(err)
      }
      Transfer.afterStripeTransferFailed(uTransfer,
        function(err, transfer){
          return cb(err, transfer)
        })
    })
  }

  afterStripeTransferFailed(transfer, next){
    //Do something after a transfer is paid
    next(null, transfer)
  }
}
