'use strict'
/* global describe, it */

const assert = require('assert')

describe('Card Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Card'])
  })
})
