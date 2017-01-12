var net = require('net');
var os = require('os')

console.log(os.networkInterfaces());


var client = new net.Socket();

client.connect((process.argv[3] || 5060), process.argv[2], function() { //'192.168.136.127'
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	// client.destroy(); // kill client after server's response
});

client.on('error', function(data) {
	console.log('Error: ' + data);
});

client.on('timeout', function(data) {
	console.log('timeout: ' + data);
});



client.on('close', function() {
	console.log('Connection closed');
});
