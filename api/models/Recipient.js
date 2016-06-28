'use strict'

const Model = require('trails-model')

/**
 * @module Recipient
 * @description Recipient Stripe Model
 */
module.exports = class Recipient extends Model {

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
              models.Recipient.hasOne(models.Card, {
                as: 'default_card',
                onDelete: 'CASCADE',
                foreignKey: {
                  allowNull: true
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
          type: 'string', //"rp_3Uh38RCOt3igvD"
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"recipient"
        },
        created: {
          type: 'datetime' //1392367798
        },
        livemode: {
          type: 'boolean' //false
        },
        type: {
          type: 'string' //"individual"
        },
        description: {
          type: 'string' //"Added through Widget"
        },
        email: {
          type: 'email' //"michael@widget"
        },
        name: {
          type: 'string' //"Mike"
        },
        verified: {
          type: 'boolean' //false
        },
        metadata: {
          type: 'json' //{}
        },
        active_account: {
          type: 'string' //null
        },
        cards: {
          type: 'json' // {}
        },
        default_card: {
          model: 'Card' //null
        },
        migrated_to: {
          type: 'string' //null
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
          type: Sequelize.STRING, //"rp_3Uh38RCOt3igvD"
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"recipient"
        },
        created: {
          type: Sequelize.DATE //1392367798
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        type: {
          type: Sequelize.STRING //"individual"
        },
        description: {
          type: Sequelize.STRING //"Added through Widget"
        },
        email: {
          type: Sequelize.STRING, //"michael@widget"
          validate: {
            isEmail: true
          }
        },
        name: {
          type: Sequelize.STRING //"Mike"
        },
        verified: {
          type: Sequelize.BOOLEAN //false
        },
        metadata: {
          type: Sequelize.JSON //{}
        },
        active_account: {
          type: Sequelize.STRING //null
        },
        cards: {
          type: Sequelize.JSON // {}
        },

        // default_card Model hasOne

        migrated_to: {
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
