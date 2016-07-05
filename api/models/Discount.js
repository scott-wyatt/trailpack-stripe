'use strict'

const Model = require('trails-model')

/**
 * @module Discount
 * @description Discount Stripe Model
 */
module.exports = class Discount extends Model {

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
              // models.Discount.belongsTo(models.Customer, {
              //   as: 'customer',
              //   onDelete: 'CASCADE',
              //   foreignKey: {
              //     allowNull: false
              //   }
              // })

              // models.Discount.belongsTo(models.Subscription, {
              //   as: 'subscription',
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
          type: 'string', //"Trial"
          primaryKey: true,
          unique: true
        },
        coupon: {
          type: 'json' //josn
        },
        start: {
          type: 'datetime' //1390790362
        },
        object: {
          type: 'string' //"discount"
        },
        customer: {
          model: 'Customer' //"cus_5nCK3XjDZ9bU3d"
        },
        subscription: {
          model: 'Subscription' //null
        },
        end: {
          type: 'datetime' //null
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
          type: Sequelize.STRING, //"Trial"
          primaryKey: true,
          unique: true
        },
        coupon: sJSON('coupons'),
        start: {
          type: Sequelize.DATE //1390790362
        },
        object: {
          type: Sequelize.STRING //"discount"
        },

        // customer Model belongsTo
        customer: {
          type: Sequelize.STRING //null
        },

        // subscription Model belongsTo
        subscription: {
          type: Sequelize.STRING //null
        },

        end: {
          type: Sequelize.DATE //null
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }

  // Stripe Webhook customer.discount.created
  stripeCustomerDiscountCreated (discount, cb) {
    const StripeService = this.app.services.StripeService
    const Discount = this.app.models.Discount
    StripeService.dbStripeEvent('Discount', discount, (err, uDiscount) => {
      if (err) {
        return cb(err)
      }
      Discount.afterStripeCustomerDiscountCreated(uDiscount, function(err, discount){
        return cb(err, discount)
      })
    })
  }

  afterStripeCustomerDiscountCreated(discount, next){
    //Do somethings after a discount is created
    next(null, discount)
  }

  // Stripe Webhook customer.discount.updated
  stripeCustomerDiscountUpdated (discount, cb) {
    const StripeService = this.app.services.StripeService
    const Discount = this.app.models.Discount
    StripeService.dbStripeEvent('Discount', discount, (err, uDiscount) => {
      if (err) {
        return cb(err)
      }
      Discount.afterStripeCustomerDiscountUpdated(uDiscount, function(err, discount){
        return cb(err, discount)
      })
    })
  }

  afterStripeCustomerDiscountUpdated(discount, next){
    //Do somethings after a discount is created
    next(null, discount)
  }

  // Stripe Webhook customer.discount.deleted
  stripeCustomerDiscountDeleted (discount, cb) {
    const crud = this.app.services.FootprintService
    const Discount = this.app.models.Discount

    crud.destroy('Discount',discount.id)
    .then(discounts => {
      Discount.afterStripeCustomerDiscountDeleted(discounts[0], function(err, discount){
        return cb(err, discount)
      })
    })
    .catch(cb)
  }

  afterStripeCustomerDiscountDeleted(discount, next){
    //Do somethings after a discount is created
    next(null, discount)
  }
}
