'use strict'
/* global describe, it */

const assert = require('assert')

describe('Customer Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Customer'])
  })
})
