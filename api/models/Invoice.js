'use strict'

const Model = require('trails-model')

/**
 * @module Invoice
 * @description Invoice Stripe Model
 */
module.exports = class Invoice extends Model {

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
              models.Invoice.hasOne(models.Customer, {
                as: 'customer',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: false
                }
              })

              models.Invoice.hasOne(models.Charge, {
                as: 'charge',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: true
                }
              })

              models.Invoice.hasOne(models.Subscription, {
                as: 'subscription',
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
          type: 'string', //"in_5OfJeYHbLtvBJ7"
          primaryKey: true,
          unique: true
        },
        date: {
          type: 'datetime' // 1416984752
        },
        period_start: {
          type: 'datetime' // 1416984752,
        },
        period_end: {
          type: 'datetime' //1419576752,
        },
        lines: {
          type: 'json'
        },
        subtotal: {
          type: 'integer' //29995,
        },
        total: {
          type: 'integer' //29995,
        },
        customer: {
          model: 'Customer' // "cus_5NKIMdRFc0TcW8"
        },
        object: {
          type: 'string' // "invoice",
        },
        attempted: {
          type: 'boolean'
        },
        closed: {
          type: 'boolean'
        },
        forgiven: {
          type: 'boolean'
        },
        paid: {
          type: 'boolean'
        },
        livemode: {
          type: 'boolean'
        },
        attempt_count: {
          type: 'integer' //1,
        },
        amount_due: {
          type: 'integer' //29995,
        },
        currency: {
          type: 'string' // "usd",
        },
        starting_balance: {
          type: 'integer' //0,
        },
        ending_balance: {
          type: 'integer' //0,
        },
        next_payment_attempt: {
          type: 'datetime' // null
        },
        webhooks_delivered_at: {
          type: 'datetime' // 1416984752
        },
        charge: {
          model: 'Charge' // "ch_5OgJ2PFbShUkxe",
        },
        discount: {
          type: 'json'
        },
        application_fee: {
          type: 'integer' //null
        },
        subscription: {
          model: 'Subscription' // "sub_2v2VGqj8Syg0l8",
        },
        tax: {
          type: 'integer' //null,
        },
        tax_percent: {
          type: 'float' //null
        },
        metadata: {
          type: 'json'
        },
        statement_descriptor: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        receipt_number: {
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
          type: Sequelize.STRING, //"in_5OfJeYHbLtvBJ7"
          primaryKey: true,
          unique: true
        },
        date: {
          type: Sequelize.DATE // 1416984752
        },
        period_start: {
          type: Sequelize.DATE // 1416984752,
        },
        period_end: {
          type: Sequelize.DATE //1419576752,
        },
        lines: {
          type: Sequelize.JSON
        },
        subtotal: {
          type: Sequelize.INTEGER //29995,
        },
        total: {
          type: Sequelize.INTEGER //29995,
        },

        // customer Model hasOne

        object: {
          type: Sequelize.STRING // "invoice",
        },
        attempted: {
          type: Sequelize.BOOLEAN
        },
        closed: {
          type: Sequelize.BOOLEAN
        },
        forgiven: {
          type: Sequelize.BOOLEAN
        },
        paid: {
          type: Sequelize.BOOLEAN
        },
        livemode: {
          type: Sequelize.BOOLEAN
        },
        attempt_count: {
          type: Sequelize.INTEGER //1,
        },
        amount_due: {
          type: Sequelize.INTEGER //29995,
        },
        currency: {
          type: Sequelize.STRING // "usd",
        },
        starting_balance: {
          type: Sequelize.INTEGER //0,
        },
        ending_balance: {
          type: Sequelize.INTEGER //0,
        },
        next_payment_attempt: {
          type: Sequelize.DATE // null
        },
        webhooks_delivered_at: {
          type: Sequelize.DATE // 1416984752
        },

        // charge Model hasOne

        discount: {
          type: Sequelize.JSON
        },
        application_fee: {
          type: Sequelize.INTEGER //null
        },

        // subscription Model hasOne

        tax: {
          type: Sequelize.INTEGER //null,
        },
        tax_percent: {
          type: Sequelize.FLOAT //null
        },
        metadata: {
          type: Sequelize.JSON
        },
        statement_descriptor: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        receipt_number: {
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
