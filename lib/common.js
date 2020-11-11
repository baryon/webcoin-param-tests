'use strict'

const levelup = require('levelup')
const memdown = require('memdown')

function createDb () {
  return levelup(Math.random().toString(36), { db: memdown })
}

module.exports = { createDb: createDb }
