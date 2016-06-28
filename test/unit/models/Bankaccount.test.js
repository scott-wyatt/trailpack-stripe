'use strict'
/* global describe, it */

const assert = require('assert')

describe('Bankaccount Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Bankaccount'])
  })
})
