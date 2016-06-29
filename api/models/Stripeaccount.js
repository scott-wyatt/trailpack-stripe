'use strict'

const Model = require('trails-model')

/**
 * @module Stripeaccount
 * @description Stripe Account Stripe Model
 */
module.exports = class Stripeaccount extends Model {

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
          type: 'string', //"acct_xxxxxxxxxxxxxxx",
          primaryKey: true,
          unique: true
        },
        email: {
          type: 'email'
        },
        statement_descriptor: {
          type: 'string'
        },
        display_name: {
          type: 'string'
        },
        timezone: {
          type: 'string'
        },
        details_submitted: {
          type: 'boolean'
        },
        charges_enabled: {
          type: 'boolean'
        },
        transfers_enabled: {
          type: 'boolean'
        },
        currencies_supported: {
          type: 'array'
        },
        default_currency: {
          type: 'string'
        },
        country: {
          type: 'string'
        },
        object: {
          type: 'string'
        },
        business_name: {
          type: 'string'
        },
        business_url: {
          type: 'string'
        },
        support_phone: {
          type: 'string'
        },
        business_logo: {
          type: 'string'
        },
        managed: {
          type: 'boolean'
        },
        product_description: {
          type: 'string'
        },
        debit_negative_balances: {
          type: 'boolean'
        },
        bank_accounts: {
          type: 'json'
        },
        verification: {
          type: 'json'
        },
        transfer_schedule: {
          type: 'json'
        },
        tos_acceptance: {
          type: 'json'
        },
        legal_entity: {
          type: 'json'
        },
        decline_charge_on: {
          type: 'json'
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: 'datetime'
        }
      }
    }
    else if (app.config.database.orm === 'sequelize') {
      const arrayType = Sequelize.ARRAY
      schema = {
        id: {
          type: Sequelize.STRING, //"acct_xxxxxxxxxxxxxxx",
          primaryKey: true,
          unique: true
        },
        email: {
          type: Sequelize.STRING,
          validate: {
            isEmail: true
          }
        },
        statement_descriptor: {
          type: Sequelize.STRING
        },
        display_name: {
          type: Sequelize.STRING
        },
        timezone: {
          type: Sequelize.STRING
        },
        details_submitted: {
          type: Sequelize.BOOLEAN
        },
        charges_enabled: {
          type: Sequelize.BOOLEAN
        },
        transfers_enabled: {
          type: Sequelize.BOOLEAN
        },
        currencies_supported: {
          type: arrayType(Sequelize.STRING)
        },
        default_currency: {
          type: Sequelize.STRING
        },
        country: {
          type: Sequelize.STRING
        },
        object: {
          type: Sequelize.STRING
        },
        business_name: {
          type: Sequelize.STRING
        },
        business_url: {
          type: Sequelize.STRING
        },
        support_phone: {
          type: Sequelize.STRING
        },
        business_logo: {
          type: Sequelize.STRING
        },
        managed: {
          type: Sequelize.BOOLEAN
        },
        product_description: {
          type: Sequelize.STRING
        },
        debit_negative_balances: {
          type: Sequelize.BOOLEAN
        },
        bank_accounts: {
          type: Sequelize.JSON
        },
        verification: {
          type: Sequelize.JSON
        },
        transfer_schedule: {
          type: Sequelize.JSON
        },
        tos_acceptance: {
          type: Sequelize.JSON
        },
        legal_entity: {
          type: Sequelize.JSON
        },
        decline_charge_on: {
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

  // Stripe Webhook account.updated
  stripeAccountUpdated (stripeaccount, cb) {
    const StripeService = this.app.services.StripeService
    const Stripeaccount = this.app.models.Stripeaccount
    StripeService.dbStripeEvent('Stripeaccount', stripeaccount, (err, uStripeaccount) => {
      if (err) {
        return cb(err)
      }
      Stripeaccount.afterStripeStripeaccountCreated(uStripeaccount, function(err, stripeaccount){
        return cb(err, stripeaccount)
      })
    })
  }

  // Stripe Webhook account.application.deauthorized
  stripeAccountApplicationDeauthorized(application, cb) {

    //Occurs whenever a user deauthorizes an application. Sent to the related application only.
    //Custom logic to handle when an application was deauthorized
    cb(null, application)
  }
}
