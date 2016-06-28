'use strict'
/* global describe, it */

const assert = require('assert')

describe('Bitcoin Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Bitcoin'])
  })
})
