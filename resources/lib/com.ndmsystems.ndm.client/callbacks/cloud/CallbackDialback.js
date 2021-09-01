const ae3 = require('ae3');

/**
 * https://ndss.ndmsystems.com/documentation#dialback-callback
 */

const HTTP_CONFIGURATION = {
	factory : 'HTTP',
	ignoreTargetPort : true,
	reverseProxied : true,
	ifModifiedSince : "before"
};

const CallbackDialback = module.exports = ae3.Class.create(
	"CallbackDialback",
	require("./../AbstractCallback"),
	function(args){
		this.serviceName = args[1];
		this.anchorName = args[2];
		this.domainName = args[3];
		this.targetAddr = args[4];
		this.targetPort = args[5] | 0;
		this.targetPath = args[6];
		this.tunnelType = args[7] | 0;
		this.sessionToken = args[8];
		if(!this.sessionToken){
			return null;
		}
		this.clientAddress = args[9];
		return this;
	},
	{
		"requestCallback" : {
			value : function(query){
				if(query && this.clientAddress) {
					query = query.addAttribute('X-Forwarded-For', this.clientAddress);
					query = query.addAttribute('X-Debug', "through ndm.client::uhp::dialback");
				}
				console.log("ndm.client:callback:dialback: web request: %s", Format.jsDescribe(query));
				return ae3.web.WebInterface.dispatch(query);
			}
		},
		"replyCallback" : {
			value : function(reply){
				if(!reply){
					console.log("ndm.client:callback:dialback: no reply");
					this.socket.close();
					return;
				}
				switch(reply.code){
				case 101: {
					console.log("ndm.client:callback:dialback: switch protocol, reply: %s, %s", Format.jsDescribe(reply), this.socket);

					switch(this.tunnelType % 100){
					case 43:
					case 83:
						console.log("ndm.client:callback:dialback: wrap server socket (TLS), tunnelType: %s, %s", this.tunnelType, this.socket);
						this.socket = ae3.net.ssl.wrapServer(//
							this.socket, //
							ae3.net.ssl.getDomainStore(//
								this.anchorName + '.' + this.domainName, //
								CallbackDialback.PROTOCOLS, //
								CallbackDialback.CIPHERS//
							)//
						);
					}

					this.server = new ae3.web.HttpServerParser( //
							this.socket, //
							this.requestCallback.bind(this), //
							(this.tunnelType % 100) === 43 || (this.tunnelType % 100) === 83, //
							HTTP_CONFIGURATION //
					);
					console.log("ndm.client:callback:dialback: http server connected, %s", this.server);
					return;
				}
				}
				console.log("ndm.client:callback:dialback: reply: %s", Format.jsDescribe(reply));
				this.socket.close();
				return;
			}
		},
		"connectCallback" : {
			value : function(socket){
				if(!socket){
					console.log("ndm.client:callback:dialback: tcp connect failed: %s:%s", this.targetAddr, this.targetPort);
					return;
				}
				console.log(">>>>>> ndm.client:callback:cloud/dialback: tcp connected, %s:%s %s", this.targetAddr, this.targetPort, this.tunnelType);

				switch(this.tunnelType % 100){
				case 0:
				case 77:
				case 80:
				case 81:
				case 90:
					console.log("ndm.client:callback:dialback: wrap client socket (TLS), tunnelType: %s, %s", this.tunnelType, this.socket);
					socket = ae3.net.ssl.wrapClient(socket, null, this.targetAddr, this.targetPort, null);
				}

				var output = '', key;
				$output(output){
					= 'GET /'; = this.targetPath; = ' HTTP/1.1\r\n';
					= 'Host: '; = this.targetAddress; = '\r\n';
					= 'Connection: Upgrade\r\n';
					= 'Upgrade: ndm-tunnel\r\n';
					= 'Content-Length: 0\r\n';
					= 'X-Session-Token: '; = this.sessionToken; = '\r\n';
					= '\r\n';
				}

				const parser = new ae3.web.HttpReplyParser();
				parser.callback = this.replyCallback.bind(this);
				socket.source.connectTarget(parser);
				
				socket.target.absorbBuffer(ae3.Transfer.createBufferUtf8(output));
				socket.target.force();
				this.socket = socket;
				console.log("ndm.client:callback:dialback: request sent: socket: %s, length: %s", socket, output.length + '');
				return;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log(">>>>>> ndm.client:callback:cloud/dialback: connecting, %s", Format.jsObject(this));
				ae3.net.tcp.connect(this.targetAddr, this.targetPort, this.connectCallback.bind(this), {
					timeout : 5000,
					reuseTimeout : 5000,
					reuseBuffer : 32,
					optionFastRead : true,
					optionClient : true
				});
			}
		},
	},
	{
		"PROTOCOLS" : {
			value : [
				"TLSv1.3",
				"TLSv1.2",
				"TLSv1.1",
				"TLSv1",
				// "SSLv3",
				// "SSLv2Hello",
			]
		},
		"CIPHERS" : {
			value : [ 
				// 'SSL_RSA_WITH_RC4_128_MD5',
				// 'SSL_RSA_WITH_RC4_128_SHA',
				// 'SSL_RSA_EXPORT_WITH_RC4_40_MD5',
				// 'SSL_RSA_EXPORT_WITH_DES40_CBC_SHA'
				
				// 'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384', // RSA key only
				'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384'
				'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384',
				'TLS_RSA_WITH_AES_256_CBC_SHA256',
				// 'TLS_ECDH_ECDSA_WITH_AES_256_CBC_SHA384', // RSA key only
				'TLS_ECDH_RSA_WITH_AES_256_CBC_SHA384',
				
				// 'TLS_DHE_RSA_WITH_AES_256_CBC_SHA256', // insecure
				// 'TLS_DHE_DSS_WITH_AES_256_CBC_SHA256', // insecure
				
				// 'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA', // RSA key only
				'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
				// 'TLS_ECDH_ECDSA_WITH_AES_256_CBC_SHA', // RSA key only
				'TLS_ECDH_RSA_WITH_AES_256_CBC_SHA',
				'TLS_RSA_WITH_AES_256_GCM_SHA384',
				// 'TLS_RSA_WITH_AES_256_CBC_SHA', // blocks FS with IE, disabled until SERVER_ORDER in jdk8
				
				'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
				// 'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA', // RSA key only
				'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
				'TLS_RSA_WITH_AES_128_CBC_SHA256',
				'TLS_RSA_WITH_AES_128_GCM_SHA256',
				// 'TLS_ECDH_ECDSA_WITH_AES_128_CBC_SHA',  // RSA key only
				'TLS_ECDH_RSA_WITH_AES_128_CBC_SHA',
				// 'TLS_RSA_WITH_AES_128_CBC_SHA', // IE8-10 prefers it otherwise

				// 'TLS_DHE_RSA_WITH_AES_256_CBC_SHA', // old OpenSSL - insecure
				// 'TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA', // IE - DSS key - insecure and no DSS key
				
				// 'TLS_RSA_WITH_3DES_EDE_CBC_SHA', // 112 bit, for IE8/XP, makes others choose it, disabled until SERVER_ORDER in jdk8
				// 'SSL_RSA_WITH_3DES_EDE_CBC_SHA', // 112 bit, for IE8/XP, makes others choose it, disabled until SERVER_ORDER in jdk8
				
				// 'TLS_ECDHE_ECDSA_WITH_3DES_EDE_CBC_SHA', // RSA key only
				// 'TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA', // obsolete
				
				// 'TLS_DHE_RSA_WITH_AES_128_CBC_SHA', // insecure
				
				// 'TLS_DHE_RSA_WITH_3DES_EDE_CBC_SHA', // insecure: Android2, OpenSSL0.9, Safari5 
				// 'SSL_DHE_RSA_WITH_3DES_EDE_CBC_SHA', // insecure: Android2, OpenSSL0.9, Safari5 
			]
		}
	}
);

