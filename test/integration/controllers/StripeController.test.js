'use strict'
/* global describe, it */

const assert = require('assert')
const supertest = require('supertest')

describe('StripeController', () => {
  let request

  before((done) => {
    request = supertest('http://localhost:3000')
    done()
  })

  it('should exist', () => {
    assert(global.app.api.controllers['StripeController'])
  })

  it('should reject webhook', (done) => {
    request
      .post('/stripe/webhook')
      .set('Accept', 'application/json') //set header for this test
      .send({ 'hello': 'world'})
      .expect(400)
      .end((err, res) => {
        done(err)
      })
  })

  it('should accept webhook', (done) => {
    request
      .post('/stripe/webhook')
      .set('Accept', 'application/json') //set header for this test
      .send({
        'id': 'evt_18RUaM2eZvKYlo2CKP2FmLbV',
        'object': 'event',
        'api_version': '2016-06-15',
        'created': 1467152498,
        'data': {
          'object': {
            'id': 'ch_18RUaM2eZvKYlo2C1vtmIpNC',
            'object': 'charge',
            'amount': 500,
            'amount_refunded': 0,
            'application_fee': null,
            'balance_transaction': 'txn_18RUaM2eZvKYlo2CgeaPK1k0',
            'captured': true,
            'created': 1467152498,
            'currency': 'usd',
            'customer': 'cus_8iwTB2lIB36tu7',
            'description': 'Charge for VirtuMedix consultation for facpat13 jt',
            'destination': null,
            'dispute': null,
            'failure_code': null,
            'failure_message': null,
            'fraud_details': {
            },
            'invoice': null,
            'livemode': false,
            'metadata': {
            },
            'order': null,
            'paid': true,
            'receipt_email': null,
            'receipt_number': null,
            'refunded': false,
            'refunds': {
              'object': 'list',
              'data': [

              ],
              'has_more': false,
              'total_count': 0,
              'url': '/v1/charges/ch_18RUaM2eZvKYlo2C1vtmIpNC/refunds'
            },
            'shipping': null,
            'source': {
              'id': 'card_18RUaL2eZvKYlo2CipWT5QCv',
              'object': 'card',
              'address_city': null,
              'address_country': null,
              'address_line1': null,
              'address_line1_check': null,
              'address_line2': null,
              'address_state': null,
              'address_zip': null,
              'address_zip_check': null,
              'brand': 'Visa',
              'country': 'US',
              'customer': 'cus_8iwTB2lIB36tu7',
              'cvc_check': 'pass',
              'dynamic_last4': null,
              'exp_month': 5,
              'exp_year': 2020,
              'fingerprint': 'Xt5EWLLDS7FJjR1c',
              'funding': 'credit',
              'last4': '4242',
              'metadata': {
              },
              'name': null,
              'tokenization_method': null
            },
            'source_transfer': null,
            'statement_descriptor': null,
            'status': 'succeeded'
          }
        },
        'livemode': false,
        'pending_webhooks': 0,
        'request': 'req_8iwTDnIujjw1Hg',
        'type': 'charge.succeeded'
      })
      .expect(200)
      .end((err, res) => {
        // console.log(res.body)
        assert.equal(res.body.id, 'evt_18RUaM2eZvKYlo2CKP2FmLbV')
        done(err)
      })
  })
})
