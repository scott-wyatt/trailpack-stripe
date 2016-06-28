'use strict'

const Model = require('trails-model')

/**
 * @module Coupon
 * @description Coupon Stripe Model
 */
module.exports = class Coupon extends Model {

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
          type: 'string', //"Trial"
          primaryKey: true,
          unique: true
        },
        created: {
          type: 'datetime' //1390771427
        },
        percent_off: {
          type: 'integer' //10
        },
        amount_off: {
          type: 'integer' //10
        },
        currency: {
          type: 'string' ///"usd"
        },
        object: {
          type: 'string' //"coupon"
        },
        livemode: {
          type: 'boolean' //false
        },
        duration: {
          type: 'string' //"once"
        },
        redeem_by: {
          type: 'datetime' //1390771427
        },
        max_redemptions: {
          type: 'integer' //null
        },
        times_redeemed: {
          type: 'integer' //1
        },
        duration_in_months: {
          type: 'integer' //null
        },
        valid: {
          type: 'boolean' //true
        },
        metadata: {
          type: 'json' //{}
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
          type: Sequelize.STRING, //"Trial"
          primaryKey: true,
          unique: true
        },
        created: {
          type: Sequelize.DATE //1390771427
        },
        percent_off: {
          type: Sequelize.INTEGER //10
        },
        amount_off: {
          type: Sequelize.INTEGER //10
        },
        currency: {
          type: Sequelize.STRING ///"usd"
        },
        object: {
          type: Sequelize.STRING //"coupon"
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        duration: {
          type: Sequelize.STRING //"once"
        },
        redeem_by: {
          type: Sequelize.DATE //1390771427
        },
        max_redemptions: {
          type: Sequelize.INTEGER //null
        },
        times_redeemed: {
          type: Sequelize.INTEGER //1
        },
        duration_in_months: {
          type: Sequelize.INTEGER //null
        },
        valid: {
          type: Sequelize.BOOLEAN //true
        },
        metadata: {
          type: Sequelize.JSON //{}
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
