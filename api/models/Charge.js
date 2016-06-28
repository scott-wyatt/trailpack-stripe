'use strict'

const Model = require('trails-model')

/**
 * @module Charge
 * @description Charge Stripe Model
 */
module.exports = class Charge extends Model {

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
              models.Charge.hasOne(models.Customer, {
                as: 'customer',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: false
                }
              })

              models.Charge.hasOne(models.Invoice, {
                as: 'invoice',
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
          type: 'string',
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"charge"
        },
        created: {
          type: 'datetime' //1425083749
        },
        livemode: {
          type: 'boolean' //false
        },
        paid: {
          type: 'boolean' //true
        },
        status: {
          type: 'string' //false
        },
        amount: {
          type: 'integer' //50
        },
        currency: {
          type: 'string' //usd
        },
        refunded: {
          type: 'boolean' //false
        },
        source: {
          type: 'json' //{}
        },
        captured: {
          type: 'boolean' //true
        },
        balance_transaction: {
          type: 'string' //null
        },
        failure_message: {
          type: 'string' //null
        },
        failure_code: {
          type: 'string' //null
        },
        amount_refunded: {
          type: 'integer' //0
        },
        customer: {
          model: 'Customer' //"cus_5MM1RcCBWYpcy7"
        },
        invoice: {
          model: 'Invoice' //null
        },
        description: {
          type: 'string' //"Charge for funds transfer to customer=%cus_5asUj0MST5mHUt",
        },
        dispute: {
          type: 'string' //null
        },
        metadata: {
          type: 'json' // {"customerFrom": "54a5977904a91e011336bb63","customerTo": "54c800d280fc70e38a7469e1"},
        },
        statement_descriptor: {
          type: 'string' //null
        },
        fraud_details: {
          type: 'json' // {}
        },
        receipt_email: {
          type: 'string' //null
        },
        receipt_number: {
          type: 'string' //null
        },
        shipping: {
          type: 'string' //null
        },
        application_fee: {
          type: 'string' //null
        },
        refunds: {
          type: 'json' //{ object": "list", "total_count": 0, "has_more": false, "url": "/v1/charges/ch_5mXfl1ok3CV6xn/refunds", "data": []}
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
          type: Sequelize.STRING //"charge"
        },
        created: {
          type: Sequelize.DATE //1425083749
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        paid: {
          type: Sequelize.BOOLEAN //true
        },
        status: {
          type: Sequelize.STRING //false
        },
        amount: {
          type: Sequelize.INTEGER //50
        },
        currency: {
          type: Sequelize.STRING //usd
        },
        refunded: {
          type: Sequelize.BOOLEAN //false
        },
        source: {
          type: Sequelize.JSON //{}
        },
        captured: {
          type: Sequelize.BOOLEAN //true
        },
        balance_transaction: {
          type: Sequelize.STRING //null
        },
        failure_message: {
          type: Sequelize.STRING //null
        },
        failure_code: {
          type: Sequelize.STRING //null
        },
        amount_refunded: {
          type: Sequelize.INTEGER //0
        },

        // customer Model hasOne

        // invoice Model hasOne

        description: {
          type: Sequelize.STRING //"Charge for funds transfer to customer=%cus_5asUj0MST5mHUt",
        },
        dispute: {
          type: Sequelize.STRING //null
        },
        metadata: {
          type: Sequelize.JSON // {"customerFrom": "54a5977904a91e011336bb63","customerTo": "54c800d280fc70e38a7469e1"},
        },
        statement_descriptor: {
          type: Sequelize.STRING //null
        },
        fraud_details: {
          type: Sequelize.JSON // {}
        },
        receipt_email: {
          type: Sequelize.STRING //null
        },
        receipt_number: {
          type: Sequelize.STRING //null
        },
        shipping: {
          type: Sequelize.STRING //null
        },
        application_fee: {
          type: Sequelize.STRING //null
        },
        refunds: {
          type: Sequelize.JSON //{ object": "list", "total_count": 0, "has_more": false, "url": "/v1/charges/ch_5mXfl1ok3CV6xn/refunds", "data": []}
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
