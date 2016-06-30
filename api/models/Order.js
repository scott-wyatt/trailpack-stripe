'use strict'
/* eslint new-cap: ["error", { "capIsNewExceptions": ["ARRAY"] }] */
const Model = require('trails-model')

/**
 * @module Order
 * @description Order Stripe Model
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
              // models.Order.belongsTo(models.Customer, {
              //   as: 'customer',
              //   onDelete: 'CASCADE',
              //   foreignKey: {
              //     allowNull: false
              //   }
              // })

              // models.Order.belongsTo(models.Charge, {
              //   as: 'charge',
              //   onDelete: 'CASCADE',
              //   foreignKey: {
              //     allowNull: true
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
        metadata: sJSON('metadata'),

        // customer Model belongsTo
        customer: {
          type: Sequelize.STRING //null
        },

        shipping: sJSON('shipping'),
        email: {
          type: Sequelize.STRING //null
        },
        items: sARRAY(),
        shipping_methods: sARRAY(),
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

        // charge Model belongsTo
        charge: {
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

  // Stripe Webhook order.created
  stripeOrderCreated(order, cb) {
    const StripeService = this.app.services.StripeService
    const Order = this.app.models.Order
    StripeService.dbStripeEvent('Order', order, (err, uOrder) => {
      if (err) {
        return cb(err)
      }
      Order.afterStripeOrderCreated(uOrder, function(err, order){
        return cb(err, order)
      })
    })
  }

  afterStripeOrderCreated(order, next){
    //Do somethings after an invoice item is created
    next(null, order)
  }

  // Stripe Webhook order.updated
  stripeOrderUpdated(order, cb) {
    const StripeService = this.app.services.StripeService
    const Order = this.app.models.Order
    StripeService.dbStripeEvent('Order', order, (err, uOrder) => {
      if (err) {
        return cb(err)
      }
      Order.afterStripeOrderUpdated(uOrder, function(err, order){
        return cb(err, order)
      })
    })
  }

  afterStripeOrderUpdated(order, next){
    //Do somethings after an invoice item is created
    next(null, order)
  }

  // Stripe Webhook order.payment_succeeded
  stripeOrderPaymentSucceeded(order, cb) {
    const StripeService = this.app.services.StripeService
    const Order = this.app.models.Order
    StripeService.dbStripeEvent('Order', order, (err, uOrder) => {
      if (err) {
        return cb(err)
      }
      Order.afterStripeOrderPaymentSucceeded(uOrder, function(err, order){
        return cb(err, order)
      })
    })
  }

  afterStripeOrderPaymentSucceeded(order, next){
    //Do somethings after an order payment succeeded
    next(null, order)
  }

  // Stripe Webhook order.payment_failed
  stripeOrderPaymentFailed(order, cb) {
    const StripeService = this.app.services.StripeService
    const Order = this.app.models.Order
    StripeService.dbStripeEvent('Order', order, (err, uOrder) => {
      if (err) {
        return cb(err)
      }
      Order.afterStripeOrderPaymentFailed(uOrder, function(err, order){
        return cb(err, order)
      })
    })
  }

  afterStripeOrderPaymentFailed(order, next){
    //Do somethings after an order payment succeeded
    next(null, order)
  }
}
