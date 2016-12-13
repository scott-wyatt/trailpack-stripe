'use strict'

const Model = require('trails/model')

/**
 * @module Refund
 * @description Refund Stripe Model
 */
module.exports = class Refund extends Model {

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
              // models.Refund.belongsTo(models.Charge, {
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
          type: 'string', //"re_3IH1NqUxYmyx2n"
          primaryKey: true,
          unique: true
        },
        amount: {
          type: 'integer' //500
        },
        currency: {
          type: 'string' //"usd"
        },
        created: {
          type: 'datetime' //1389503275
        },
        object: {
          type: 'string' //"refund"
        },
        balance_transaction: {
          type: 'string' //"txn_3IH1XgiGk6NelI"
        },
        metadata: {
          type: 'json' //{}
        },
        charge: {
          model: 'Charge' //"ch_3HzoDMtpbhBooS"
        },
        receipt_number: {
          type: 'string' //null
        },
        reason: {
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
          type: Sequelize.STRING, //"re_3IH1NqUxYmyx2n"
          primaryKey: true,
          unique: true
        },
        amount: {
          type: Sequelize.INTEGER //500
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        created: {
          type: Sequelize.DATE //1389503275
        },
        object: {
          type: Sequelize.STRING //"refund"
        },
        balance_transaction: {
          type: Sequelize.STRING //"txn_3IH1XgiGk6NelI"
        },
        metadata: sJSON('metadata'),

        //charge Model belongsTo
        charge: {
          type: Sequelize.STRING //null
        },

        receipt_number: {
          type: Sequelize.STRING //null
        },
        reason: {
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
