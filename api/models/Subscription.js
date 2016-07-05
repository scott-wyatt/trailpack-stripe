'use strict'

const Model = require('trails-model')

/**
 * @module Subscription
 * @description Subscription Stripe Model
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
          if (values.current_period_start) {
            values.current_period_start = new Date(values.current_period_start * 1000)
          }
          if (values.current_period_end) {
            values.current_period_end = new Date(values.current_period_end * 1000)
          }
          if (values.ended_at) {
            values.ended_at = new Date(values.ended_at * 1000)
          }
          if (values.trial_start) {
            values.trial_start = new Date(values.trial_start * 1000)
          }
          if (values.trial_end) {
            values.trial_end = new Date(values.trial_end * 1000)
          }
          if (values.canceled_at) {
            values.canceled_at = new Date(values.canceled_at * 1000)
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
              if (values.current_period_start) {
                values.current_period_start = new Date(values.current_period_start * 1000)
              }
              if (values.current_period_end) {
                values.current_period_end = new Date(values.current_period_end * 1000)
              }
              if (values.ended_at) {
                values.ended_at = new Date(values.ended_at * 1000)
              }
              if (values.trial_start) {
                values.trial_start = new Date(values.trial_start * 1000)
              }
              if (values.trial_end) {
                values.trial_end = new Date(values.trial_end * 1000)
              }
              if (values.canceled_at) {
                values.canceled_at = new Date(values.canceled_at * 1000)
              }
              fn()
            }
          },
          classMethods: {
            //If you need associations, put them here
            associate: (models) => {
              //More information about associations here : http://docs.sequelizejs.com/en/latest/docs/associations/
              // models.Subscription.belongsTo(models.Customer, {
              //   as: 'customer',
              //   onDelete: 'CASCADE',
              //   foreignKey: {
              //     allowNull: false
              //   }
              // })
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
          type: Sequelize.STRING, // sub_xxxxxxxxxx
          primaryKey: true,
          unique: true
        },
        plan: sJSON('plan'),

        // customer Model belongsTo
        customer: {
          type: Sequelize.STRING //null
        },

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
        discount: sJSON('discount'),
        tax_percent: {
          type: Sequelize.FLOAT
        },
        metadata: sJSON('metadata'),

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }

  // Stripe Webhook customer.subscription.created
  stripeCustomerSubscriptionCreated(subscription, cb) {
    const StripeService = this.app.services.StripeService
    const Subscription = this.app.models.Subscription
    StripeService.dbStripeEvent('Subscription', subscription, (err, uSubscription) => {
      if (err) {
        return cb(err)
      }
      Subscription.afterStripeCustomerSubscriptionCreated(uSubscription,
        function(err, subscription){
          return cb(err, subscription)
        })
    })
  }

  afterStripeCustomerSubscriptionCreated(subscription, next){
    //Do something after subscription is created
    next(null, subscription)
  }

  // Stripe Webhook customer.subscription.updated
  stripeCustomerSubscriptionUpdated (subscription, cb) {
    const StripeService = this.app.services.StripeService
    const Subscription = this.app.models.Subscription
    StripeService.dbStripeEvent('Subscription', subscription, (err, uSubscription) => {
      if (err) {
        return cb(err)
      }
      Subscription.afterStripeCustomerSubscriptionUpdated(uSubscription,
        function(err, subscription){
          return cb(err, subscription)
        })
    })
  }

  afterStripeCustomerSubscriptionUpdated(subscription, next){
    //Do something after subscription is updated
    next(null, subscription)
  }

  // Stripe Webhook customer.subscription.deleted
  stripeCustomerSubscriptionDeleted (subscription, cb) {
    const crud = this.app.services.FootprintService
    const Subscription = this.app.models.Subscription

    crud.destroy('Subscription',subscription.id)
    .then(subscriptions => {
      Subscription.afterStripeSubscriptionDeleted(subscriptions[0], function(err, subscription){
        return cb(err, subscription)
      })
    })
    .catch(cb)
  }

  afterStripeCustomerSubscriptionDeleted(subscription, next){
    //Do something after subscription is destroyed
    next(null, subscription)
  }

  // Stripe Webhook customer.subscription.trial_will_end
  stripeCustomerSubscriptionTrial (subscription, cb) {
    //Occurs three days before the trial period of a subscription is scheduled to end.
    //Custom logic to handle that: add an email or notification or something.
    const StripeService = this.app.services.StripeService
    const Subscription = this.app.models.Subscription
    StripeService.dbStripeEvent('Subscription', subscription, (err, uSubscription) => {
      if (err) {
        return cb(err)
      }
      Subscription.afterStripeCustomerSubscriptionTrial(uSubscription, function(err, subscription){
        return cb(err, subscription)
      })
    })
  }

  afterStripeCustomerSubscriptionTrial(subscription, next){
    //Do something after subscription trail wanring
    next(null, subscription)
  }
}
