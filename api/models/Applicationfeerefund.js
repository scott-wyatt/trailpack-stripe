'use strict'

const Model = require('trails-model')

/**
 * @module Applicationfeerefund
 * @description Application Fee Stripe Model
 */
module.exports = class Applicationfeerefund extends Model {

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
              models.Applicationfeerefund.hasOne(models.Applicationfee, {
                as: 'fee',
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
          type: 'string', //"fr_xxxxxxxxx",
          primaryKey: true,
          unique: true
        },
        amount: {
          type: 'integer' //100
        },
        currency: {
          type: 'string' //"usd"
        },
        created: {
          type: 'datetime' //1428165432
        },
        object: {
          type: 'string' //"fee_refund"
        },
        balance_transaction: {
          type: 'string' //null
        },
        metadata: {
          type: 'json' // {}
        },
        fee: {
          model: 'Applicationfee' //"fee_xxxxxxxxxx"
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
          type: Sequelize.STRING, //"fr_xxxxxxxxx",
          primaryKey: true,
          unique: true
        },
        amount: {
          type: Sequelize.INTEGER //100
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        created: {
          type: Sequelize.DATE //1428165432
        },
        object: {
          type: Sequelize.STRING //"fee_refund"
        },
        balance_transaction: {
          type: Sequelize.STRING //null
        },
        metadata: {
          type: Sequelize.JSON // {}
        },

        // fee Model hasOne

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }
}
