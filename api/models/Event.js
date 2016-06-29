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
        data: sJSON('data'),
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
