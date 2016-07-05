'use strict'

const Model = require('trails-model')

/**
 * @module Orderitem
 * @description Order Item Stripe Model
 */
module.exports = class Orderitem extends Model {

  static config (app) {
    let config = {}

    if (app && (app.config.database.orm === 'waterline' || app.config.database.orm === 'js-data')) {
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
          type: 'string', //"oritem_16q4o6Bw8aZ7QiYmxfWfodKl"
          primaryKey: true,
          unique: true
        },
        parent: {
          type: 'string' //"sku_74DEICYJxo7XQF"
        },
        object: {
          type: 'string' //"order_item"
        },
        type: {
          type: 'string' //"sku"
        },
        description: {
          type: 'string' //"T-shirt"
        },
        amount: {
          type: 'integer' //1500
        },
        currency: {
          type: 'string' //"usd"
        },
        quantity: {
          type: 'integer' //null
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
          type: Sequelize.STRING, //"or_16q4o6Bw8aZ7QiYmxfWfodKl"
          primaryKey: true,
          unique: true
        },
        parent: {
          type: Sequelize.STRING //"sku_74DEICYJxo7XQF"
        },
        object: {
          type: Sequelize.STRING //"order_item"
        },
        type: {
          type: Sequelize.STRING //"sku"
        },
        description: {
          type: Sequelize.STRING //"T-shirt"
        },
        amount: {
          type: Sequelize.INTEGER //1500
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        quantity: {
          type: Sequelize.INTEGER //null
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
