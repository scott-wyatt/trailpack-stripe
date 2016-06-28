'use strict'
/* global describe, it */

const assert = require('assert')

describe('Plan Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Plan'])
  })
})
