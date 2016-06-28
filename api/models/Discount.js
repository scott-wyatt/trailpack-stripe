'use strict'

const Model = require('trails-model')

/**
 * @module Discount
 * @description Discount Stripe Model
 */
module.exports = class Discount extends Model {

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
              models.Discount.hasOne(models.Customer, {
                as: 'customer',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: false
                }
              })

              models.Discount.hasOne(models.Subscription, {
                as: 'subscription',
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
          type: 'string', //"Trial"
          primaryKey: true,
          unique: true
        },
        coupon: {
          type: 'json' //josn
        },
        start: {
          type: 'datetime' //1390790362
        },
        object: {
          type: 'string' //"discount"
        },
        customer: {
          model: 'Customer' //"cus_5nCK3XjDZ9bU3d"
        },
        subscription: {
          model: 'Subscription' //null
        },
        end: {
          type: 'datetime' //null
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
        coupon: {
          type: Sequelize.JSON //josn
        },
        start: {
          type: Sequelize.DATE //1390790362
        },
        object: {
          type: Sequelize.STRING //"discount"
        },

        // customer Model hasOne

        // subscription Model hasOne

        end: {
          type: Sequelize.DATE //null
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
