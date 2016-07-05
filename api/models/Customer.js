'use strict'

const Model = require('trails-model')

/**
 * @module Customer
 * @description Customer Stripe Model
 */
module.exports = class Customer extends Model {

  static config (app) {
    let config = {}

    if (app && (app.config.database.orm === 'waterline' || app.config.database.orm === 'js-data')) {
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
    if (app.config.database.orm === 'waterline' || app.config.database.orm === 'js-data') {
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

      const database = app.config.database

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
        }
      }
      else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
        sJSON = (field) => {
          return {
            type: Sequelize.JSON
          }
        }
      }

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
        metadata: sJSON('metadata'),
        subscriptions: sJSON('subscriptions'),
        discount: {
          type: Sequelize.INTEGER
        },
        account_balance: {
          type: Sequelize.INTEGER
        },
        currency: {
          type: Sequelize.STRING
        },
        sources: sJSON('sources'),
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

  // Stripe Webhook customer.updated
  stripeCustomerCreated(customer, cb) {
    const StripeService = this.app.services.StripeService
    const Customer = this.app.models.Customer
    StripeService.dbStripeEvent('Customer', customer, (err, uCustomer) => {
      if (err) {
        return cb(err)
      }
      Customer.afterStripeCustomerCreated(uCustomer, function(err, customer){
        return cb(err, customer)
      })
    })
  }

  afterStripeCustomerCreated(customer, next){
    //Add somethings to do after a customer is created
    next(null, customer)
  }

  // Stripe Webhook customer.updated
  stripeCustomerUpdated(customer, cb) {
    const StripeService = this.app.services.StripeService
    const Customer = this.app.models.Customer
    StripeService.dbStripeEvent('Customer', customer, (err, uCustomer) => {
      if (err) {
        return cb(err)
      }
      Customer.afterStripeCustomerUpdated(uCustomer, function(err, customer){
        return cb(err, customer)
      })
    })
  }

  afterStripeCustomerUpdated(customer, next){
    //Add somethings to do after a customer is updated
    next(null, customer)
  }

  // Stripe Webhook customer.deleted
  stripeCustomerDeleted(customer, cb){
    const crud = this.app.services.FootprintService
    const Customer = this.app.models.Customer

    crud.destroy('Customer',customer.id)
    .then(customers => {
      Customer.afterStripeCustomerDeleted(customers[0], function(err, customer){
        return cb(err, customer)
      })
    })
    .catch(cb)
  }

  afterStripeCustomerDeleted(customer, next){
    //Add somethings to do after a customer is deleted
    next(null, customer)
  }
}
