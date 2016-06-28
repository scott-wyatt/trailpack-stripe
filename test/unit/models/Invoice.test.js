'use strict'
/* global describe, it */

const assert = require('assert')

describe('Invoice Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Invoice'])
  })
})
