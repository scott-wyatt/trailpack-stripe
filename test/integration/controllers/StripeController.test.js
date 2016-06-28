'use strict'
/* global describe, it */

const assert = require('assert')

describe('StripeController', () => {
  it('should exist', () => {
    assert(global.app.api.controllers['StripeController'])
  })
})
