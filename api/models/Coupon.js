'use strict'

const Model = require('trails/model')

/**
 * @module Coupon
 * @description Coupon Stripe Model
 */
module.exports = class Coupon extends Model {

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
          type: 'string', //"Trial"
          primaryKey: true,
          unique: true
        },
        created: {
          type: 'datetime' //1390771427
        },
        percent_off: {
          type: 'integer' //10
        },
        amount_off: {
          type: 'integer' //10
        },
        currency: {
          type: 'string' ///"usd"
        },
        object: {
          type: 'string' //"coupon"
        },
        livemode: {
          type: 'boolean' //false
        },
        duration: {
          type: 'string' //"once"
        },
        redeem_by: {
          type: 'datetime' //1390771427
        },
        max_redemptions: {
          type: 'integer' //null
        },
        times_redeemed: {
          type: 'integer' //1
        },
        duration_in_months: {
          type: 'integer' //null
        },
        valid: {
          type: 'boolean' //true
        },
        metadata: {
          type: 'json' //{}
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
        created: {
          type: Sequelize.DATE //1390771427
        },
        percent_off: {
          type: Sequelize.INTEGER //10
        },
        amount_off: {
          type: Sequelize.INTEGER //10
        },
        currency: {
          type: Sequelize.STRING ///"usd"
        },
        object: {
          type: Sequelize.STRING //"coupon"
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        duration: {
          type: Sequelize.STRING //"once"
        },
        redeem_by: {
          type: Sequelize.DATE //1390771427
        },
        max_redemptions: {
          type: Sequelize.INTEGER //null
        },
        times_redeemed: {
          type: Sequelize.INTEGER //1
        },
        duration_in_months: {
          type: Sequelize.INTEGER //null
        },
        valid: {
          type: Sequelize.BOOLEAN //true
        },
        metadata: sJSON('metadata'), //{}

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }

  // Stripe Webhook coupon.created
  stripeCouponCreated(coupon, cb) {
    const StripeService = this.app.services.StripeService
    const Coupon = this.app.models.Coupon
    StripeService.dbStripeEvent('Coupon', coupon, (err, uCoupon) => {
      if (err) {
        return cb(err)
      }
      Coupon.afterStripeCouponCreated(uCoupon, function(err, coupon){
        return cb(err, coupon)
      })
    })
  }

  afterStripeCouponCreated(coupon, next){
    //Add somethings to do after a coupon is created
    next(null, coupon)
  }

  // Stripe Webhook coupon.deleted
  stripeCouponDeleted(coupon, cb) {
    const crud = this.app.services.FootprintService
    const Coupon = this.app.models.Coupon

    crud.destroy('Coupon',coupon.id)
    .then(coupons => {
      Coupon.afterStripeCustomerCardDeleted(coupons[0], function(err, coupon){
        return cb(err, coupon)
      })
    })
    .catch(cb)
  }

  afterStripeCouponDeleted(coupon, next){
    //Add somethings to do after a coupon is deleted
    next(null, coupon)
  }
}
