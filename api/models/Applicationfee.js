'use strict'

const Model = require('trails-model')

/**
 * @module Applicationfee
 * @description Application Fee Stripe Model
 */
module.exports = class Applicationfee extends Model {

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
              models.Applicationfee.hasOne(models.Charge, {
                as: 'charge',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: false
                }
              })
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
          type: 'string', //"fee_5zu43QOh0tbSiC"
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"application_fee"
        },
        created: {
          type: 'datetime' //1428165432
        },
        livemode: {
          type: 'boolean' //false
        },
        amount: {
          type: 'integer' //100
        },
        currency: {
          type: 'string' //"usd"
        },
        refunded: {
          type: 'boolean' //false
        },
        amount_refunded: {
          type: 'integer' //0
        },
        refunds: {
          type: 'json' //{}
        },
        balance_transaction: {
          type: 'string' //"txn_2v2VcOoVgfuxzP"
        },
        account: {
          type: 'string' //"acct_0LK1iaScxogiHw8SRtHg"
        },
        application: {
          type: 'string' //"ca_5zu4wDltE3SnpyqIFnPbp7IRPkv6c76z"
        },
        charge: {
          model: 'Charge' //"ch_5mXfl1ok3CV6xn"
        },
        originating_transaction: {
          type: 'string' //null
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: 'datetime'
        }
      }
    }
    else if (app.config.database.orm === 'sequelize') {
      schema = {
        id: {
          type: Sequelize.STRING, //"fee_5zu43QOh0tbSiC"
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"application_fee"
        },
        created: {
          type: Sequelize.DATE //1428165432
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        amount: {
          type: Sequelize.INTEGER //100
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        refunded: {
          type: Sequelize.BOOLEAN //false
        },
        amount_refunded: {
          type: Sequelize.INTEGER //0
        },
        refunds: {
          type: Sequelize.JSON //{}
        },
        balance_transaction: {
          type: Sequelize.STRING //"txn_2v2VcOoVgfuxzP"
        },
        account: {
          type: Sequelize.STRING //"acct_0LK1iaScxogiHw8SRtHg"
        },
        application: {
          type: Sequelize.STRING //"ca_5zu4wDltE3SnpyqIFnPbp7IRPkv6c76z"
        },

        // Charge Model hasOne

        originating_transaction: {
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

  stripeApplicationFeeCreated (fee, cb) {
    const StripeService = this.app.services.StripeService
    const Applicationfee = this.app.models.Applicationfee
    StripeService.dbStripeEvent('Applicationfee', fee, (err, uFee) => {
      if (err) {
        this.app.log.error(err)
        return cb(err)
      }
      Applicationfee.afterStripeApplicationFeeCreated(uFee, function(err, fee){
        return cb(err, fee)
      })
    })
  }

  afterStripeApplicationFeeCreated(fee, next){
    //Do somethings after application fee is created
    next(null, fee)
  }

  // Stripe Webhook application_fee.refunded
  stripeApplicationFeeRefunded(fee, cb) {
    const StripeService = this.app.services.StripeService
    const Applicationfee = this.app.models.Applicationfee
    StripeService.dbStripeEvent('Applicationfee', fee, (err, uFee) => {
      if (err) {
        this.app.log.error(err)
        return cb(err)
      }
      Applicationfee.afterStripeApplicationFeeRefunded(uFee, function(err, fee){
        return cb(err, fee)
      })
    })
  }

  afterStripeApplicationFeeRefunded(fee, next){
    //Do somethings after application fee is created
    next(null, fee)
  }
}
