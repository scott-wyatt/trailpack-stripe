'use strict'

const Model = require('trails-model')

/**
 * @module Product
 * @description TODO document Model
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
        attributes: {
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
        attributes: {
          type: Sequelize.ARRAY
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
          type: Sequelize.ARRAY
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
}
