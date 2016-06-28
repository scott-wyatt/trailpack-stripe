'use strict'

const Model = require('trails-model')

/**
 * @module Event
 * @description Event Stripe Model
 */
module.exports = class Event extends Model {

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
          type: 'string', //"evt_5zfGsQQRVg9T9N",
          primaryKey: true,
          unique: true
        },
        created: {
          type: 'datetime' //1428110317
        },
        livemode: {
          type: 'boolean' //false
        },
        type: {
          type: 'string' //"invoice.payment_succeeded"
        },
        data: {
          type: 'json'
        },
        object: {
          type: 'string' //"event"
        },
        pending_webhooks: {
          type: 'integer' //0
        },
        request: {
          type: 'string' //null
        },
        api_version: {
          type: 'string' //"2012-07-09"
        }
      }
    }
    else if (app.config.database.orm === 'sequelize') {
      schema = {
        id: {
          type: Sequelize.STRING, //"evt_5zfGsQQRVg9T9N",
          primaryKey: true,
          unique: true
        },
        created: {
          type: Sequelize.DATE //1428110317
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        type: {
          type: Sequelize.STRING //"invoice.payment_succeeded"
        },
        data: {
          type: Sequelize.JSON
        },
        object: {
          type: Sequelize.STRING //"event"
        },
        pending_webhooks: {
          type: Sequelize.INTEGER //0
        },
        request: {
          type: Sequelize.STRING //null
        },
        api_version: {
          type: Sequelize.STRING //"2012-07-09"
        }
      }
    }
    return schema
  }
}
