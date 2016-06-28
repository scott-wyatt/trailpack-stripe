'use strict'

const Model = require('trails-model')

/**
 * @module Bankaccount
 * @description TODO document Model
 */
module.exports = class Bankaccount extends Model {

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
              models.Bankaccount.hasOne(models.Customer, {
                as: 'customer',
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
          type: 'string', //"ba_16q4nxBw8aZ7QiYmwqM3lvdR"
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"bank_account"
        },
        last4: {
          type: 'string' //"6789"
        },
        country: {
          type: 'string' //"US"
        },
        currency: {
          type: 'string' //"usd"
        },
        status: {
          type: 'string' //"new"
        },
        fingerprint: {
          type: 'string' //"4bS4RP1zGQ1IeDdc"
        },
        routing_number: {
          type: 'string' //"110000000"
        },
        bank_name: {
          type: 'string' //"STRIPE TEST BANK"
        },
        account: {
          type: 'string' //"acct_15SXCKBw8aZ7QiYm"
        },
        default_for_currency: {
          type: 'boolean' //false
        },
        metadata: {
          type: 'json' // {}
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
      schema = {
        id: {
          type: Sequelize.STRING, //"ba_16q4nxBw8aZ7QiYmwqM3lvdR"
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"bank_account"
        },
        last4: {
          type: Sequelize.STRING //"6789"
        },
        country: {
          type: Sequelize.STRING //"US"
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        status: {
          type: Sequelize.STRING //"new"
        },
        fingerprint: {
          type: Sequelize.STRING //"4bS4RP1zGQ1IeDdc"
        },
        routing_number: {
          type: Sequelize.STRING //"110000000"
        },
        bank_name: {
          type: Sequelize.STRING //"STRIPE TEST BANK"
        },
        account: {
          type: Sequelize.STRING //"acct_15SXCKBw8aZ7QiYm"
        },
        default_for_currency: {
          type: Sequelize.BOOLEAN //false
        },
        metadata: {
          type: Sequelize.JSON // {}
        },

        // customer Model hasOne

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }
}
