'use strict'

const Model = require('trails-model')

/**
 * @module Subscription
 * @description TODO document Model
 */
module.exports = class Subscription extends Model {

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
              models.Subscription.hasOne(models.Customer, {
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
          type: 'string', // sub_xxxxxxxxxx
          primaryKey: true,
          unique: true
        },
        plan: {
          type: 'json'
        },
        customer: {
          model: 'Customer'
        },
        object: {
          type: 'string' // "subscription"
        },
        start: {
          type: 'datetime'
        },
        status: {
          type: 'string'
        },
        cancel_at_period_end: {
          type: 'boolean'
        },
        current_period_start: {
          type: 'datetime'
        },
        current_period_end: {
          type: 'datetime'
        },
        ended_at: {
          type: 'datetime'
        },
        trial_start: {
          type: 'datetime'
        },
        trial_end: {
          type: 'datetime'
        },
        canceled_at: {
          type: 'datetime'
        },
        quantity: {
          type: 'integer'
        },
        application_fee_percent: {
          type: 'float'
        },
        discount: {
          type: 'json'
        },
        tax_percent: {
          type: 'float'
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
          type: Sequelize.STRING, // sub_xxxxxxxxxx
          primaryKey: true,
          unique: true
        },
        plan: {
          type: Sequelize.JSON
        },

        // customer Model hasOne

        object: {
          type: Sequelize.STRING // "subscription"
        },
        start: {
          type: Sequelize.DATE
        },
        status: {
          type: Sequelize.STRING
        },
        cancel_at_period_end: {
          type: Sequelize.BOOLEAN
        },
        current_period_start: {
          type: Sequelize.DATE
        },
        current_period_end: {
          type: Sequelize.DATE
        },
        ended_at: {
          type: Sequelize.DATE
        },
        trial_start: {
          type: Sequelize.DATE
        },
        trial_end: {
          type: Sequelize.DATE
        },
        canceled_at: {
          type: Sequelize.DATE
        },
        quantity: {
          type: Sequelize.INTEGER
        },
        application_fee_percent: {
          type: Sequelize.FLOAT
        },
        discount: {
          type: Sequelize.JSON
        },
        tax_percent: {
          type: Sequelize.FLOAT
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
