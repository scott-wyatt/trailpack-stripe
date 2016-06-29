'use strict'

const Model = require('trails-model')

/**
 * @module Sku
 * @description Sku Stripe Model
 */
module.exports = class Sku extends Model {

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
              models.Sku.hasOne(models.Product, {
                as: 'product',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: false
                }
              })
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
          type: 'string', //"sku_74DEICYJxo7XQF"
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
          type: 'string' //"sku"
        },
        livemode: {
          type: 'boolean' //false
        },
        product: {
          model: 'Product' //"prod_74DESReKhddEzB"
        },
        image: {
          type: 'string' //null
        },
        active: {
          type: 'boolean' //true
        },
        price: {
          type: 'integer' //1500
        },
        currency: {
          type: 'string' //"usd"
        },
        inventory: {
          type: 'json' // {type: "finite", quantity: 50, value: null}
        },
        itemAttributes: {
          type: 'json'
        },
        metadata: {
          type: 'json'
        },
        package_dimensions: {
          type: 'json'
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
          type: Sequelize.STRING, //"sku_74DEICYJxo7XQF"
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
          type: Sequelize.STRING //"sku"
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },

        // product Model hasOne

        image: {
          type: Sequelize.STRING //null
        },
        active: {
          type: Sequelize.BOOLEAN //true
        },
        price: {
          type: Sequelize.INTEGER //1500
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        inventory: {
          type: Sequelize.JSON // {type: "finite", quantity: 50, value: null}
        },
        itemAttributes: {
          type: Sequelize.JSON
        },
        metadata: {
          type: Sequelize.JSON
        },
        package_dimensions: {
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

  // Stripe Webhook sku.created
  stripeSkuCreated(sku, cb) {
    const StripeService = this.app.services.StripeService
    const Sku = this.app.models.Sku
    StripeService.dbStripeEvent('Sku', sku, (err, uSku) => {
      if (err) {
        return cb(err)
      }
      Sku.afterStripeSkuCreated(uSku, function(err, sku){
        return cb(err, sku)
      })
    })
  }

  afterStripeSkuCreated(sku, next){
    //Do somethings after a sku is created
    next(null, sku)
  }

  // Stripe Webhook sku.updated
  stripeSkuUpdated(sku, cb) {
    const StripeService = this.app.services.StripeService
    const Sku = this.app.models.Sku
    StripeService.dbStripeEvent('Sku', sku, (err, uSku) => {
      if (err) {
        return cb(err)
      }
      Sku.afterStripeSkuUpdated(uSku, function(err, sku){
        return cb(err, sku)
      })
    })
  }

  afterStripeSkuUpdated(sku, next){
    //Do somethings after a sku is updated
    next(null, sku)
  }
}
