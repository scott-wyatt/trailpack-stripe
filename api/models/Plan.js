'use strict'

const Model = require('trails/model')

/**
 * @module Plan
 * @description Plan Stripe Model
 */
module.exports = class Plan extends Model {

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
        interval: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        created: {
          type: 'datetime'
        },
        amount: {
          type: 'string'
        },
        currency: {
          type: 'string'
        },
        plan_id: {
          type: 'string'
        },
        object: {
          type: 'string'
        },
        livemode: {
          type: 'boolean'
        },
        interval_count: {
          type: 'integer'
        },
        trial_period_days: {
          type: 'integer'
        },
        metadata: {
          type: 'json'
        },
        statement_descriptor: {
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
        interval: {
          type: Sequelize.STRING
        },
        name: {
          type: Sequelize.STRING
        },
        created: {
          type: Sequelize.DATE
        },
        amount: {
          type: Sequelize.STRING
        },
        currency: {
          type: Sequelize.STRING
        },
        plan_id: {
          type: Sequelize.STRING
        },
        object: {
          type: Sequelize.STRING
        },
        livemode: {
          type: Sequelize.BOOLEAN
        },
        interval_count: {
          type: Sequelize.INTEGER
        },
        trial_period_days: {
          type: Sequelize.INTEGER
        },
        metadata: sJSON('metadata'),
        statement_descriptor: {
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

  // Stripe Webhook plan.created
  stripePlanCreated (plan, cb) {
    const StripeService = this.app.services.StripeService
    const Plan = this.app.models.Plan
    StripeService.dbStripeEvent('Plan', plan, (err, uPlan) => {
      if (err) {
        return cb(err)
      }
      Plan.afterStripePlanCreated(uPlan, function(err, plan){
        return cb(err, plan)
      })
    })
  }

  afterStripePlanCreated(plan, next){
    //Do somethings after a plan is created
    next(null, plan)
  }

  // Stripe Webhook plan.updated
  stripePlanUpdated (plan, cb) {
    const StripeService = this.app.services.StripeService
    const Plan = this.app.models.Plan
    StripeService.dbStripeEvent('Plan', plan, (err, uPlan) => {
      if (err) {
        return cb(err)
      }
      Plan.afterStripePlanUpdated(uPlan, function(err, plan){
        return cb(err, plan)
      })
    })
  }

  afterStripePlanUpdated(plan, next){
    //Do somethings after a plan is updated
    next(null, plan)
  }

  // Stripe Webhook plan.created
  stripePlanDeleted (plan, cb) {
    const crud = this.app.services.FootprintService
    const Plan = this.app.models.Plan

    crud.destroy('Plan',plan.id)
    .then(plans => {
      Plan.afterStripePlanDeleted(plans[0], function(err, plan){
        return cb(err, plan)
      })
    })
    .catch(cb)
  }

  afterStripePlanDeleted(plan, next){
    //Do somethings after a plan is destroyed
    next(null, plan)
  }
}
