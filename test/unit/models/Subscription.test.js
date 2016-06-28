'use strict'
/* global describe, it */

const assert = require('assert')

describe('Subscription Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Subscription'])
  })
})
