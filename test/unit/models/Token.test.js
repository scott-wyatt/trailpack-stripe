'use strict'
/* global describe, it */

const assert = require('assert')

describe('Token Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Token'])
  })
})
