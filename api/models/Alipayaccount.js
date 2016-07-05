'use strict'

const Model = require('trails-model')

/**
 * @module Alipayaccount
 * @description Alipay Account Stripe Model
 */
module.exports = class Alipayaccount extends Model {

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
    if (app.config.database.orm === 'waterline' || app.config.database.orm === 'js-data') {
      schema = {
        id: {
          type: 'string', //"aliacc_16q4o6Bw8aZ7QiYmdCfHA1U9"
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"alipay_account"
        },
        livemode: {
          type: 'boolean' //false
        },
        created: {
          type: 'datetime' //1443458934
        },
        username: {
          type: 'string' //"test@example.com"
        },
        fingerprint: {
          type: 'string' //"fw63Hiw2UYvAUyi2"
        },
        used: {
          type: 'boolean' //false
        },
        reusable: {
          type: 'boolean' //false
        },
        payment_amount: {
          type: 'integer' //1000
        },
        payment_currency: {
          type: 'string' //"usd"
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
          type: Sequelize.STRING, //"aliacc_16q4o6Bw8aZ7QiYmdCfHA1U9"
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"alipay_account"
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        created: {
          type: Sequelize.DATE //1443458934
        },
        username: {
          type: Sequelize.STRING //"test@example.com"
        },
        fingerprint: {
          type: Sequelize.STRING //"fw63Hiw2UYvAUyi2"
        },
        used: {
          type: Sequelize.BOOLEAN //false
        },
        reusable: {
          type: Sequelize.BOOLEAN //false
        },
        payment_amount: {
          type: Sequelize.INTEGER //1000
        },
        payment_currency: {
          type: Sequelize.STRING //"usd"
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }
}
