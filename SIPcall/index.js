const sip = require('sip')
const digest = require('sip/digest')
const os = require('os')

let attempt = 0
let tryingAgainInProgress = false

const rstring = function () { return Math.floor(Math.random() * 1e6).toString() }

const network = os.networkInterfaces().eth0 || os.networkInterfaces().enp0s31f6

const startConfig = {
  publicAddress: network.find(o => o.family === 'IPv4').address, // enp0s31f6 for linux, Ethernet for windows
  hostname:      os.hostname(),
  tcp:           false,
  udp:           true
}

const credentials = {
  user:     process.env['802_USERNAME'],
  password: process.env['802_PASSWORD']
}

const pararmeters = {
  callee:   process.argv[2],
  provider: 'sip.802.cz',
  callId:   rstring(),
  fromTag:  rstring()
}

const inviteTemplate = {
  headers: {
    to:             { uri: `sip:${pararmeters.callee}@${pararmeters.provider}`, params: { transport: 'UDP' } },
    from:           { uri: `sip:${credentials.user}@${pararmeters.provider}`, params: { tag: pararmeters.fromTag } },
    'call-id':      pararmeters.callId,
    cseq:           { method: 'INVITE', seq: 1 },
    'content-type': 'application/sdp',
    contact:        [ { uri: `sip:${credentials.user}@${startConfig.publicAddress}` } ],
    'max-forwards': 68
  },
  method:  'INVITE',
  uri:     `sip:${pararmeters.callee}@${pararmeters.provider}`,
  content: 'v=0\r\n' +
           `o=Z 0 0 IN IP4 ${startConfig.publicAddress}\r\n` +
           's=Z\r\n' +
           `c=IN IP4 ${startConfig.publicAddress}\r\n` +
           't=0 0\r\n' +
           'm=audio 8000 RTP/AVP 3 110 8 0 97 101\r\n' +
           'a=rtpmap:110 speex/8000\r\n' +
           'a=rtpmap:97 iLBC/8000\r\n' +
           'a=fmtp:97 mode=30\r\n' +
           'a=rtpmap:101 telephone-event/8000\r\n' +
           'a=fmtp:101 0-16\r\n' +
           'a=sendrecv\r\n'
}

const cancelTemplate = {
  headers: {
    to:             { uri: `sip:${pararmeters.callee}@${pararmeters.provider}`, params: { transport: 'UDP' } },
    from:           { uri: `sip:${credentials.user}@${pararmeters.provider}`, params: { tag: pararmeters.fromTag } },
    'call-id':      pararmeters.callId,
    cseq:           { method: 'CANCEL', seq: 2 },
    'max-forwards': 68
  },
  method: 'CANCEL',
  uri:    `sip:${pararmeters.callee}@${pararmeters.provider}`
}

let via
let authorization

const start = function () {
  attempt++
  console.log(attempt + '. attempt')

  if (attempt > 3) { // too many attempts
    process.exit(1) // kill the process
  } else {
    // Init SIP ////////////////////////////////////////////////////////////////
    sip.start(startConfig, rq => {
      console.log('start function: ', rq)
    })

    // SIP INVITE //////////////////////////////////////////////////////////////
    sip.send(inviteTemplate, resolve)
  }
}

const resolve = function (rs) {
  if (via === undefined) { // only fill if undefined
    via = rs.headers.via
  }

  switch (true) {
    case rs.status === 486:// "busy here" status // UnRegister SIP //
      console.log('caller busy: 486')
      process.exit(0)

    case rs.status === 403: // "refusing to fullfill" status
      console.log('caller busy: 403, trying again')
      if (!tryingAgainInProgress) { // start it only once
        tryingAgainInProgress = true
        sip.stop() // kill old instance of sip
        start()
      }
      break

    case rs.status === 401 || rs.status === 407 : // new authenticate
      console.log('response', rs.status, 'authentication in progress')

      digest.signRequest({}, inviteTemplate, rs, credentials)

      if (authorization === undefined) { // only fill if undefined
        authorization = inviteTemplate.headers['proxy-authorization']
      }

      console.log('acknowledge')
      console.log(inviteTemplate)

      sip.send(inviteTemplate, resp => {
        console.log(`Authorized invite send, reponse: ${resp.status}`)
        resolve(resp)
      })
      break

    case rs.status === 180: // ringing status - wait for a bit and CANCEL
      setTimeout(() => {
        console.log('CANCELing the call')
        cancelTemplate.headers.via = via.map(object => {
          delete object.params.received
          object.params.rport = undefined
          return object
        })
        cancelTemplate.headers['proxy-authorization'] = authorization
        console.log(cancelTemplate)

        sip.send(cancelTemplate, resolve)
      }, 3000)
      break

    case rs.status >= 300:
      console.log('call failed with status ' + rs.status)
      console.log(JSON.stringify(rs))
      process.exit(1) // kill the process
      break

    case rs.status < 200:
      tryingAgainInProgress = false
      console.log('call progress status ' + rs.status)
      break

    default: // 2xx status - sending ACK`
      console.log('call answered with tag ' + rs.headers.to.params.tag)
      const ackTemplate = {
        method:  'ACK',
        uri:     rs.headers.contact[0].uri,
        headers: { to:        rs.headers.to,
          from:      rs.headers.from,
          'call-id': rs.headers['call-id'],
          cseq:      { method: 'ACK', seq: rs.headers.cseq.seq },
          via:       []
        }
      }
      sip.send(ackTemplate)
  }
}

start()
