'use strict'

const PeerGroup = require('bitcoin-net').PeerGroup
const Blockchain = require('blockchain-spv')
const createDb = require('./common.js').createDb
let wrtc
try {
  wrtc = require('wrtc')
} catch (err) {
  try {
    wrtc = require('electron-webrtc')
  } catch (err) {}
}

module.exports = function (params, test) {
  let peers
  const numPeers = 2

  test('networking', function (t) {
    t.test('create PeerGroup', function (t) {
      try {
        peers = new PeerGroup(params.net, { numPeers: numPeers, wrtc: wrtc })
        t.pass('did not throw')
        t.ok(peers, 'got PeerGroup')
        peers.on('error', function (err) {
          return t.error(err)
        })
      } catch (err) {
        t.error(err, 'error thrown')
      }
      t.end()
    })

    t.test('connect to peers', function (t) {
      const onPeer = function onPeer (peer) {
        t.ok(peer, 'connected to peer ' + peers.peers.length + '/' + numPeers)
        if (peers.peers.length < numPeers) return
        peers.removeListener('peer', onPeer)
        t.end()
      }
      peers.on('peer', onPeer)
      peers.connect()
    })

    t.test('blockchain download', function (t) {
      const db = createDb()
      const chain = new Blockchain(params.blockchain, db)
      const start = chain.getTip()
      const syncN = 3000
      chain.on('error', function (err) {
        return t.error(err)
      })

      const locators = chain.createLocatorStream()
      const headers = peers.createHeaderStream()
      const onBlock = function onBlock (block) {
        const i = block.height - start.height
        if (i % 100 === 0) {
          t.ok(block, 'sync progress: ' + i + '/' + syncN)
        }
        if (i < syncN) return
        t.pass('done syncing')
        chain.removeListener('block', onBlock)
        headers.once('end', function () {
          t.pass('HeaderStream ended')
          t.end()
        })
        headers.end()
      }
      chain.on('block', onBlock)
      locators.pipe(headers).pipe(chain.createWriteStream())
    })

    t.test('disconnect', function (t) {
      peers.close(function (err) {
        t.error(err, 'no error')
        t.pass('disconnected')
        t.end()
      })
    })

    t.end()
  })
}
