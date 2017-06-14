var sip = require('./sip')
var digest = require('./digest')
var os = require('os')

var attempt = 0
var tryingAgainInProgress = false

var rstring = function () { return Math.floor(Math.random()*1e6).toString() }

var network = os.networkInterfaces().eth0 || os.networkInterfaces().enp0s31f6

var start_config = { publicAddress: network.find((o)=>{return o.family=='IPv4'}).address //enp0s31f6 for linux, Ethernet for windows
                   , hostname: os.hostname()
                   , tcp: false
                   , udp: true
                   }

var credentials = { user: '910800031'
                  , password: 'MPI031voip4PID'
                  }

var pararmeters = { callee: process.argv[2]
                  , provider: 'sip.802.cz'
                  }

var invite_template = { method: 'INVITE'
                      , uri: `sip:${pararmeters.callee}@${pararmeters.provider}`
                      , headers: { to: {uri: `sip:${pararmeters.callee}@${pararmeters.provider}`, params: {transport: 'UDP'}}
                                 , from: {uri: `sip:${credentials.user}@${pararmeters.provider}`, params: {tag: rstring()}}
                                 , 'call-id': rstring()
                                 , cseq: {method: 'INVITE', seq: 1}
                                 , 'content-type': 'application/sdp'
                                 , contact: [{uri: `sip:${credentials.user}@${start_config.publicAddress}`}]
                                 , 'max-forwards': 68
                                 }
                      , content:
                          'v=0\r\n'+
                          `o=Z 0 0 IN IP4 ${start_config.publicAddress}\r\n`+
                          's=Z\r\n'+
                          `c=IN IP4 ${start_config.publicAddress}\r\n`+
                          't=0 0\r\n'+
                          'm=audio 8000 RTP/AVP 3 110 8 0 97 101\r\n'+
                          'a=rtpmap:110 speex/8000\r\n'+
                          'a=rtpmap:97 iLBC/8000\r\n'+
                          'a=fmtp:97 mode=30\r\n'+
                          'a=rtpmap:101 telephone-event/8000\r\n'+
                          'a=fmtp:101 0-16\r\n'+
                          'a=sendrecv\r\n'
                      }

var start = function () {
  attempt++
  console.log(attempt+'. attempt');

  if (attempt > 3) { // too many attempts
    process.exit(1); // kill the process
  } else {
    // Init SIP ////////////////////////////////////////////////////////////////
    sip.start(start_config, function(rq) {
      console.log('start function: ', rq)
    })

    // SIP INVITE //////////////////////////////////////////////////////////////
    sip.send(invite_template,
    function(rs) {
      resolve(rs)
    })
  }
}

var resolve = function(rs){
  switch (true) {
    case rs.status == 486:// "busy here" status // UnRegister SIP //
      console.log('caller busy: 486');
      process.exit(0);

    case rs.status == 403: // "refusing to fullfill" status
      console.log('caller busy: 403, trying again');
      if (!tryingAgainInProgress){ // start it only once
        tryingAgainInProgress = true
        sip.stop() // kill old instance of sip
        start()
      }

    case rs.status == 401 || rs.status == 407 : // new authenticate
      console.log('response', rs.status, 'authentication in progress');

      digest.signRequest({}, invite_template, rs, credentials)

      sip.send(invite_template, (resp) => {
        console.log(`Authorized invite send, reponse: ${resp.status}`)
        resolve(resp)
      })
      break;

    case rs.status >= 300:
      console.log('call failed with status ' + rs.status);
      process.exit(1); // kill the process
      break;

    case rs.status < 200:
      tryingAgainInProgress = false
      console.log('call progress status ' + rs.status);
      break;

    default:// 2xx status - sending ACK
      console.log('call answered with tag ' + rs.headers.to.params.tag);
      var ack_template = { method: 'ACK'
                         , uri: rs.headers.contact[0].uri
                         , headers: { to: rs.headers.to
                                    , from: rs.headers.from
                                    , 'call-id': rs.headers['call-id']
                                    , cseq: {method: 'ACK', seq: rs.headers.cseq.seq}
                                    , via: []
                                    }
                         }

      sip.send(ack_template);
  }
}

start()
