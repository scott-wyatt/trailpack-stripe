'use strict'

const Model = require('trails-model')

/**
 * @module Order
 * @description TODO document Model
 */
module.exports = class Order extends Model {

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
              models.Order.hasOne(models.Customer, {
                as: 'customer',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: false
                }
              })

              models.Order.hasOne(models.Charge, {
                as: 'charge',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: true
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
          type: 'string', //"or_16q4o6Bw8aZ7QiYmxfWfodKl"
          primaryKey: true,
          unique: true
        },
        created: {
          type: 'datetime' //1443458925
        },
        updated: {
          type: 'datetime' //1443458925
        },
        object: {
          type: 'string' //"order"
        },
        livemode: {
          type: 'boolean' //false
        },
        status: {
          type: 'string' //"created"
        },
        metadata: {
          type: 'json'
        },
        customer: {
          model: 'Customer'
        },
        shipping: {
          type: 'json'
        },
        email: {
          type: 'string' //null
        },
        items: {
          type: 'array'
        },
        shipping_methods: {
          type: 'array'
        },
        selected_shipping_method: {
          type: 'string'
        },
        amount: {
          type: 'integer' //1500
        },
        currency: {
          type: 'string' //"usd"
        },
        application_fee: {
          type: 'integer' //null
        },
        charge: {
          model: 'Charge'
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
        created: {
          type: Sequelize.DATE //1443458925
        },
        updated: {
          type: Sequelize.DATE //1443458925
        },
        object: {
          type: Sequelize.STRING //"order"
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        status: {
          type: Sequelize.STRING //"created"
        },
        metadata: {
          type: Sequelize.JSON
        },

        // customer Model hasOne

        shipping: {
          type: Sequelize.JSON
        },
        email: {
          type: Sequelize.STRING //null
        },
        items: {
          type: Sequelize.ARRAY
        },
        shipping_methods: {
          type: Sequelize.ARRAY
        },
        selected_shipping_method: {
          type: Sequelize.STRING
        },
        amount: {
          type: Sequelize.INTEGER //1500
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        application_fee: {
          type: Sequelize.INTEGER //null
        },

        // charge Model hasOne

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }
}
