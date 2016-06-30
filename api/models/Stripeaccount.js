'use strict'
/* eslint new-cap: ["error", { "capIsNewExceptions": ["ARRAY"] }] */
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

      const database = app.config.database

      let sARRAY = () => {
        return {
          type: Sequelize.STRING
        }
      }

      let sJSON = (field) =>{
        return {
          type: Sequelize.STRING,
          get: function() {
            return JSON.parse(this.getDataValue(field))
          },
          set: function(val) {
            return this.setDataValue(field, JSON.stringify(val))
          }
        }
      }

      if (database.models[this.constructor.name.toLowerCase()]) {
        if (database.stores[database.models[this.constructor.name.toLowerCase()].store].dialect == 'postgres') {
          sJSON = (field) => {
            return {
              type: Sequelize.JSON
            }
          }
          sARRAY = () => {
            return {
              type: Sequelize.ARRAY(Sequelize.STRING)
            }
          }
        }
      }
      else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
        sJSON = (field) => {
          return {
            type: Sequelize.JSON
          }
        }
        sARRAY = () => {
          return {
            type: Sequelize.ARRAY(Sequelize.STRING)
          }
        }
      }

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
        currencies_supported: sARRAY(),
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
        bank_accounts: sJSON('bank_accounts'),
        verification: sJSON('verification'),
        transfer_schedule: sJSON('transfer_schedule'),
        tos_acceptance: sJSON('tos_acceptance'),
        legal_entity: sJSON('legal_entity'),
        decline_charge_on: sJSON('decline_charge_on'),

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
