'use strict'

const Model = require('trails-model')

/**
 * @module Customer
 * @description TODO document Model
 */
module.exports = class Customer extends Model {

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
          type: 'string',
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string'
        },
        created: {
          type: 'datetime'
        },
        livemode: {
          type: 'boolean'
        },
        description: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        delinquent: {
          type: 'boolean'
        },
        metadata: {
          type: 'json'
        },
        subscriptions: {
          type: 'json'
        },
        discount: {
          type: 'integer'
        },
        account_balance: {
          type: 'integer'
        },
        currency: {
          type: 'string'
        },
        sources: {
          type: 'json'
        },
        default_source: {
          type: 'string'
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
          type: Sequelize.STRING,
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING
        },
        created: {
          type: Sequelize.DATE
        },
        livemode: {
          type: Sequelize.BOOLEAN
        },
        description: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING,
          validate: {
            isEmail: true
          }
        },
        delinquent: {
          type: Sequelize.BOOLEAN
        },
        metadata: {
          type: Sequelize.JSON
        },
        subscriptions: {
          type: Sequelize.JSON
        },
        discount: {
          type: Sequelize.INTEGER
        },
        account_balance: {
          type: Sequelize.INTEGER
        },
        currency: {
          type: Sequelize.STRING
        },
        sources: {
          type: Sequelize.JSON
        },
        default_source: {
          type: Sequelize.STRING
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
