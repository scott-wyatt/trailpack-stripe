'use strict'

const Model = require('trails-model')

/**
 * @module Transfer
 * @description TODO document Model
 */
module.exports = class Transfer extends Model {

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
          type: 'string', //"tr_xxxxxxxxxxxx"
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"transfer"
        },
        created: {
          type: 'datetime' //1393986746
        },
        date: {
          type: 'datetime' //1393986746
        },
        livemode: {
          type: 'boolean' //false
        },
        amount: {
          type: 'integer' //90800
        },
        currency: {
          type: 'string' //"usd"
        },
        reversed: {
          type: 'boolean' //false
        },
        status: {
          type: 'string' //"paid"
        },
        type: {
          type: 'string' //"bank_account"
        },
        reversals: {
          type: 'json' //{"object": "list","total_count": 0,"has_more": false,"url": "/v1/transfers/tr_3biGAn1hq8iKfo/reversals","data": []},
        },
        balance_transaction: {
          type: 'string' //"txn_2v2VcOoVgfuxzP"
        },
        bank_account: {
          type: 'json' //{"object": "bank_account","id": "ba_0LK9sazX8tPl54","last4": "3532","country": "US","currency": "usd","status": "new","fingerprint": "AMyAAyMWZEg1LDfU","routing_number": "322271627","bank_name": "J.P. MORGAN CHASE BANK, N.A.","default_for_currency": true},
        },
        destination: {
          type: 'string' //"ba_0LK9sazX8tPl54"
        },
        description: {
          type: 'string' //"STRIPE TRANSFER"
        },
        failure_message: {
          type: 'string' //null
        },
        failure_code: {
          type: 'string' //null
        },
        amount_reversed: {
          type: 'integer'//0
        },
        metadata: {
          type: 'json' //{}
        },
        statement_descriptor: {
          type: 'string' //null
        },
        recipient: {
          type: 'string' //null
        },
        source_transaction: {
          type: 'string' //null
        },
        application_fee: {
          type: 'string' //null
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
          type: Sequelize.STRING, //"tr_xxxxxxxxxxxx"
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"transfer"
        },
        created: {
          type: Sequelize.DATE //1393986746
        },
        date: {
          type: Sequelize.DATE //1393986746
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        amount: {
          type: Sequelize.INTEGER //90800
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        reversed: {
          type: Sequelize.BOOLEAN //false
        },
        status: {
          type: Sequelize.STRING //"paid"
        },
        type: {
          type: Sequelize.STRING //"bank_account"
        },
        reversals: {
          type: Sequelize.JSON //{"object": "list","total_count": 0,"has_more": false,"url": "/v1/transfers/tr_3biGAn1hq8iKfo/reversals","data": []},
        },
        balance_transaction: {
          type: Sequelize.STRING //"txn_2v2VcOoVgfuxzP"
        },
        bank_account: {
          type: Sequelize.JSON //{"object": "bank_account","id": "ba_0LK9sazX8tPl54","last4": "3532","country": "US","currency": "usd","status": "new","fingerprint": "AMyAAyMWZEg1LDfU","routing_number": "322271627","bank_name": "J.P. MORGAN CHASE BANK, N.A.","default_for_currency": true},
        },
        destination: {
          type: Sequelize.STRING //"ba_0LK9sazX8tPl54"
        },
        description: {
          type: Sequelize.STRING //"STRIPE TRANSFER"
        },
        failure_message: {
          type: Sequelize.STRING //null
        },
        failure_code: {
          type: Sequelize.STRING //null
        },
        amount_reversed: {
          type: Sequelize.INTEGER //0
        },
        metadata: {
          type: Sequelize.JSON //{}
        },
        statement_descriptor: {
          type: Sequelize.STRING //null
        },
        recipient: {
          type: Sequelize.STRING //null
        },
        source_transaction: {
          type: Sequelize.STRING //null
        },
        application_fee: {
          type: Sequelize.STRING //null
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
