'use strict'

const Blockchain = require('blockchain-spv')
const DefaultBlock = require('bitcoinjs-lib').Block
const assign = require('object-assign')
const createDb = require('./common.js').createDb

module.exports = function (params, test) {
  const Block = params.Block || DefaultBlock
  let chain

  test('blockchain', function (t) {
    t.test('create SPV Blockchain', function (t) {
      const db = createDb()
      try {
        chain = new Blockchain(params.blockchain, db)
        t.pass('did not throw')
        t.ok(chain, 'Blockchain created')
        chain.once('ready', function () {
          t.pass('chain is ready')
          t.end()
        })
      } catch (err) {
        t.error(err, 'error thrown')
        t.end()
      }
    })

    t.test('get genesis block', function (t) {
      const genesis = new Block()
      assign(genesis, params.blockchain.genesisHeader)

      chain.getBlock(genesis.getHash(), function (err, block) {
        t.ok('getBlock callback called')
        t.error(err, 'no error')
        t.ok(block, 'got block')
        t.equal(block.height, 0, 'correct block height')
        t.equal(block.header.getId(), genesis.getId(), 'correct block hash')
        t.end()
      })
    })

    t.test('miningHash', function (t) {
      const genesis = new Block()
      assign(genesis, params.blockchain.genesisHeader)

      t.test('genesis header has valid proof', function (t) {
        chain.validProof(genesis, function (err, valid) {
          t.error(err, 'no error')
          t.ok(valid, 'proof is valid')
          t.end()
        })
      })

      // FIXME: this might not be a good test since it has a chance of failing
      // for regtest params (which have a very high target)
      t.test('modified genesis header has invalid proof', function (t) {
        genesis.nonce++
        chain.validProof(genesis, function (err, valid) {
          t.error(err, 'no error')
          t.notOk(valid, 'proof is invalid')
          t.end()
        })
      })

      t.end()
    })

    t.end()
  })
}
