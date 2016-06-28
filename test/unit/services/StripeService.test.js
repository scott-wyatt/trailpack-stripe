'use strict'
/* global describe, it */

const assert = require('assert')

describe('StripeService', () => {
  it('should exist', () => {
    assert(global.app.api.services['StripeService'])
  })
})
