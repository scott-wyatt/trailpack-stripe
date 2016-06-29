'use strict'

const Model = require('trails-model')

/**
 * @module Dispute
 * @description Dispute Stripe Model
 */
module.exports = class Dispute extends Model {

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
              models.Dispute.hasOne(models.Charge, {
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
          type: 'string', //"evt_5zfGsQQRVg9T9N",
          primaryKey: true,
          unique: true
        },
        charge: {
          model: 'Charge' //"ch_5mXfl1ok3CV6xn"
        },
        amount: {
          type: 'integer' //1000
        },
        created: {
          type: 'datetime' //1428165431
        },
        status: {
          type: 'string' //"needs_response"
        },
        livemode: {
          type: 'boolean' //false
        },
        currency: {
          type: 'string' //"usd"
        },
        object: {
          type: 'string' //"dispute"
        },
        reason: {
          type: 'string' //"general"
        },
        is_charge_refundable: {
          type: 'boolean' //false
        },
        balance_transactions: {
          type: 'array' //[],
        },
        evidence_details: {
          type: 'json' //{}
        },
        evidence: {
          type: 'json' //{}
        },
        metadata: {
          type: 'json'
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

        // charge Model hasOne

        amount: {
          type: Sequelize.INTEGER //1000
        },
        created: {
          type: Sequelize.DATE //1428165431
        },
        status: {
          type: Sequelize.STRING //"needs_response"
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        object: {
          type: Sequelize.STRING //"dispute"
        },
        reason: {
          type: Sequelize.STRING //"general"
        },
        is_charge_refundable: {
          type: Sequelize.BOOLEAN //false
        },
        balance_transactions: {
          type: Sequelize.ARRAY //[],
        },
        evidence_details: {
          type: Sequelize.JSON //{}
        },
        evidence: {
          type: Sequelize.JSON //{}
        },
        metadata: {
          type: Sequelize.JSON
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
