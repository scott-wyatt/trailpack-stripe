'use strict'

const Model = require('trails-model')

/**
 * @module Product
 * @description Product Stripe Model
 */
module.exports = class Product extends Model {

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
          type: 'string', //"ba_16q4nxBw8aZ7QiYmwqM3lvdR"
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
          type: 'string' //"product"
        },
        livemode: {
          type: 'boolean' //false
        },
        name: {
          type: 'string'
        },
        caption: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        active: {
          type: 'boolean'
        },
        itemAttributes: {
          type: 'array'
        },
        shippable: {
          type: 'boolean'
        },
        metadata: {
          type: 'json'
        },
        url: {
          type: 'string'
        },
        package_dimensions: {
          type: 'json'
        },
        images: {
          type: 'array'
        },
        skus: {
          type: 'json' //"object": "list","total_count": 0,"has_more": false,"url": "/v1/skus?product=prod_74DESReKhddEzB\u0026active=true","data": []
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
          type: Sequelize.STRING, //"ba_16q4nxBw8aZ7QiYmwqM3lvdR"
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
          type: Sequelize.STRING //"product"
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        name: {
          type: Sequelize.STRING
        },
        caption: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        active: {
          type: Sequelize.BOOLEAN
        },
        itemAttributes: {
          type: arrayType(Sequelize.STRING)
        },
        shippable: {
          type: Sequelize.BOOLEAN
        },
        metadata: {
          type: Sequelize.JSON
        },
        url: {
          type: Sequelize.STRING
        },
        package_dimensions: {
          type: Sequelize.JSON
        },
        images: {
          type: arrayType(Sequelize.STRING)
        },
        skus: {
          type: Sequelize.JSON //"object": "list","total_count": 0,"has_more": false,"url": "/v1/skus?product=prod_74DESReKhddEzB\u0026active=true","data": []
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }

  // Stripe Webhook product.created
  stripeProductCreated(product, cb) {
    const StripeService = this.app.services.StripeService
    const Product = this.app.models.Product
    StripeService.dbStripeEvent('Product', product, (err, uProduct) => {
      if (err) {
        return cb(err)
      }
      Product.afterStripeProductCreated(uProduct, function(err, product){
        return cb(err, product)
      })
    })
  }

  afterStripeProductCreated(product, next){
    //Do somethings after an invoice item is created
    next(null, product)
  }

  // Stripe Webhook product.updated
  stripeProductUpdated(product, cb) {
    const StripeService = this.app.services.StripeService
    const Product = this.app.models.Product
    StripeService.dbStripeEvent('Product', product, (err, uProduct) => {
      if (err) {
        return cb(err)
      }
      Product.afterStripeProductUpdated(uProduct, function(err, product){
        return cb(err, product)
      })
    })
  }

  afterStripeProductUpdated(product, next){
    //Do somethings after an invoice item is created
    next(null, product)
  }
}
