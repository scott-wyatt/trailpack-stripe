'use strict'
/* global describe, it */

const assert = require('assert')

describe('Order Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Order'])
  })
})
