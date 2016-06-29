'use strict'

const Model = require('trails-model')

/**
 * @module Token
 * @description Token Stripe Model
 */
module.exports = class Token extends Model {

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
          type: 'string', //"tok_16GhzzBw8aZ7QiYmauEtvWUU"
          primaryKey: true,
          unique: true
        },
        livemode: {
          type: 'boolean' //false
        },
        created: {
          type: 'datetime' //1435029779
        },
        used: {
          type: 'boolean' //false
        },
        object: {
          type: 'string' //"token"
        },
        type: {
          type: 'string' //"card"
        },
        card: {
          type: 'json'
        },
        client_ip: {
          type: 'string' //null
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
          type: Sequelize.STRING, //"tok_16GhzzBw8aZ7QiYmauEtvWUU"
          primaryKey: true,
          unique: true
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        created: {
          type: Sequelize.DATE //1435029779
        },
        used: {
          type: Sequelize.BOOLEAN //false
        },
        object: {
          type: Sequelize.STRING //"token"
        },
        type: {
          type: Sequelize.STRING //"card"
        },
        card: sJSON('card'),
        client_ip: {
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
}
