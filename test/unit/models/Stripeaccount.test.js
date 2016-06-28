'use strict'
/* global describe, it */

const assert = require('assert')

describe('Stripeaccount Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Stripeaccount'])
  })
})
