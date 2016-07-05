'use strict'
/* eslint new-cap: ["error", { "capIsNewExceptions": ["ARRAY"] }] */
const Model = require('trails-model')

/**
 * @module Dispute
 * @description Dispute Stripe Model
 */
module.exports = class Dispute extends Model {

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
              // models.Dispute.belongsTo(models.Charge, {
              //   as: 'charge',
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
          type: 'string', //"evt_5zfGsQQRVg9T9N",
          primaryKey: true,
          unique: true
        },
        charge: {
          model: 'Charge' //"ch_5mXfl1ok3CV6xn"
        },
        amount: {
          type: 'integer' //1000
        },
        created: {
          type: 'datetime' //1428165431
        },
        status: {
          type: 'string' //"needs_response"
        },
        livemode: {
          type: 'boolean' //false
        },
        currency: {
          type: 'string' //"usd"
        },
        object: {
          type: 'string' //"dispute"
        },
        reason: {
          type: 'string' //"general"
        },
        is_charge_refundable: {
          type: 'boolean' //false
        },
        balance_transactions: {
          type: 'array' //[],
        },
        evidence_details: {
          type: 'json' //{}
        },
        evidence: {
          type: 'json' //{}
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
          type: Sequelize.STRING, //"or_16q4o6Bw8aZ7QiYmxfWfodKl"
          primaryKey: true,
          unique: true
        },

        // charge Model belongsTo
        charge: {
          type: Sequelize.STRING //null
        },

        amount: {
          type: Sequelize.INTEGER //1000
        },
        created: {
          type: Sequelize.DATE //1428165431
        },
        status: {
          type: Sequelize.STRING //"needs_response"
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        object: {
          type: Sequelize.STRING //"dispute"
        },
        reason: {
          type: Sequelize.STRING //"general"
        },
        is_charge_refundable: {
          type: Sequelize.BOOLEAN //false
        },
        balance_transactions: sARRAY(),
        evidence_details: sJSON('evidence_details'),
        evidence: sJSON('evidence'),
        metadata: sJSON('metadata'),

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }

  // Stripe Webhook charge.dispute.created
  stripeChargeDisputeCreated(dispute, cb) {
    const StripeService = this.app.services.StripeService
    const Dispute = this.app.models.Dispute
    StripeService.dbStripeEvent('Dispute', dispute, (err, uDispute) => {
      if (err) {
        return cb(err)
      }
      Dispute.afterStripeChargeDisputeCreated(uDispute, function(err, dispute){
        return cb(err, dispute)
      })
    })
  }

  afterStripeChargeDisputeCreated(dispute, next){
    //Do somethings after a charge dispute is created
    next(null, dispute)
  }

  // Stripe Webhook charge.dispute.updated
  stripeChargeDisputeUpdated(dispute, cb) {
    const StripeService = this.app.services.StripeService
    const Dispute = this.app.models.Dispute
    StripeService.dbStripeEvent('Dispute', dispute, (err, uDispute) => {
      if (err) {
        return cb(err)
      }
      Dispute.afterStripeChargeDisputeUpdated(uDispute, function(err, dispute){
        return cb(err, dispute)
      })
    })
  }

  afterStripeChargeDisputeUpdated(dispute, next){
    //Do somethings after a charge dispute is updated
    next(null, dispute)
  }

  // Stripe Webhook charge.dispute.closed
  stripeChargeDisputeClosed(dispute, cb) {
    const StripeService = this.app.services.StripeService
    const Dispute = this.app.models.Dispute
    StripeService.dbStripeEvent('Dispute', dispute, (err, uDispute) => {
      if (err) {
        return cb(err)
      }
      Dispute.afterStripeChargeDisputeClosed(uDispute, function(err, dispute){
        return cb(err, dispute)
      })
    })
  }

  afterStripeChargeDisputeClosed(dispute, next){
    //Do somethings after a charge dispute is updated
    next(null, dispute)
  }

  // Stripe Webhook charge.dispute.funds_withdrawn
  stripeChargeDisputeFundsWithdrawn(dispute, cb) {
    const StripeService = this.app.services.StripeService
    const Dispute = this.app.models.Dispute
    StripeService.dbStripeEvent('Dispute', dispute, (err, uDispute) => {
      if (err) {
        return cb(err)
      }
      Dispute.afterStripeChargeDisputeFundsWithdrawn(uDispute, function(err, dispute){
        return cb(err, dispute)
      })
    })
  }

  afterStripeChargeDisputeFundsWithdrawn(dispute, next){
    //Do somethings after a charge dispute funds withdrawn
    next(null, dispute)
  }

  stripeChargeDisputeFundsReinstated(dispute, cb) {
    const StripeService = this.app.services.StripeService
    const Dispute = this.app.models.Dispute
    StripeService.dbStripeEvent('Dispute', dispute, (err, uDispute) => {
      if (err) {
        return cb(err)
      }
      Dispute.afterStripeChargeDisputeFundsReinstated(uDispute, function(err, dispute){
        return cb(err, dispute)
      })
    })
  }

  afterStripeChargeDisputeFundsReinstated(dispute, next){
    //Do somethings after a charge dispute is reinstated
    next(null, dispute)
  }
}
