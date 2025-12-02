/**
 * tunnelDial
 * 
* Schemes supported:
* - "ndms+http:"
* 		+ TcpConnect (fail if remote management is disabled)
* 		+ TlsClientWrap (unless fingerprint is undefined)
* 		+ HandshakeTunnel (Upgrade request -- 101 response)
* 		+ TlsUnwrap (unless fingerprint is undefined)
* 		+ ConnectManagementInterface (SSL/TLS RCI Server)
* 
* - "ndm+https:"
* 		+ TcpConnect (fail if remote management is disabled)
* 		+ TlsClientWrap (use fingerprint check if defined)
* 		+ HandshakeTunnel (Upgrade request -- 101 response)
* 		+ ConnectManagementInterface (Plain Secure Internal Back-End)
* 
* - "sndns+http:"
* 		+ TcpConnect (fail if public access firewall rules deny)
* 		+ TlsClientWrap (unless fingerprint is undefined)
* 		+ HandshakeTunnel (Upgrade request -- 101 response)
* 		+ TlsUnwrap (unless fingerprint is undefined)
* 		+ ConnectPublicWebInterface (SSL/TLS Public Web)
* 
* - "ndns+https"
* 		+ TcpConnect (fail if public access firewall rules deny)
* 		+ TlsClientWrap (use fingerprint check if defined)
* 		+ HandshakeTunnel (Upgrade request -- 101 response)
* 		+ ConnectPublicWebInterface (Plain Public Web)
 * 
 */


const ae3 = require("ae3");

const UrlParseFn = URL.parse;

const TcpConnect = ae3.net.tcp.connect;
const TransferCreateBufferUtf8 = ae3.Transfer.createBufferUtf8;
const SslWrapClient = ae3.net.ssl.wrapClient;
const HttpReplyParser = ae3.web.HttpReplyParser;
const SslUnwrap = ae3.net.ssl.unwrap;
const SslWrapServer = ae3.net.ssl.wrapServer;
const HttpServerParser = ae3.web.HttpServerParser;

const TUNNEL_PROTOCOL_SCHEMES = {
	"ndms+http:" : {
		tlsClientRequired : false,
		tlsClientUnwrap : true,
		tlsServerWrap : true,
	},
	"ndm+https:" : {
		tlsClientRequired : true,
		tlsClientUnwrap : false,
		tlsServerWrap : false,
	},
	"sndns+http:" : {
		tlsClientRequired : false,
		tlsClientUnwrap : true,
		tlsServerWrap : true,
	},
	"ndns+https:" : {
		tlsClientRequired : true,
		tlsClientUnwrap : false,
		tlsServerWrap : false,
	},
};

const CONNECT_CONFIGURATION = {
	connectTimeout : 5000,
	reuseTimeout : 5000,
	reuseBuffer : 32,
	optionFastRead : true,
	optionClient : true
};

const HTTP_CONFIGURATION = {
	factory : "HTTP",
	ignoreTargetPort : true,
	reverseProxied : true,
	ifModifiedSince : "before"
};

const CallbackTunnelDial = module.exports = ae3.Class.create(
	"CallbackTunnelDial",
	require("./../AbstractCallback"),
	function(args){
		this.intent = args[0];
		this.serviceId = args[1];
		this.tunnelType = args[2];
		this.targetUrl = args[3];
		this.sessionToken = args[4];
		this.handshakeData = args[5];
		this.timestampSeconds = args[6];
		this.ecSignature = args[7];
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){

				this.client = component.client;
				
				const keys = component.confirmedMatingKeys;
				if(!keys){
					console.log(
						"ndm.client::CallbackTunnelDial:prepareCallback: refused: no service link established %s", 
						this.serviceId
					);
					return false;
				}

				// TODO: check signature
				
				this.urlObject = UrlParseFn(this.tunnelType + this.targetUrl);
				if(!urlObject){
					console.log(
						"ndm.client::CallbackTunnelDial:prepareCallback: refused: no or invalid url: %s, serviceId: %s", 
						this.tunnelType + this.targetUrl, 
						this.serviceId
					);
					return false;
				}
				
				this.tunnelProtocol = url?.protocol;

				const protocol = TUNNEL_PROTOCOL_SCHEMES;
				if(!protocol){
					console.log(
						"ndm.client::CallbackTunnelDial:prepareCallback: refused: unsupported protocol scheme: %s, serviceId: %s", 
						this.tunnelProtocol, 
						this.serviceId
					);
					return 0x64;
				}

				this.targetAddr = url.hostname;
				this.targetPort = url.port;

				if(!this.targetAddr || !this.targetPort){
					console.log(
						"ndm.client::CallbackTunnelDial:prepareCallback: refused: no host or port: %s, serviceId: %s", 
						url.host, 
						this.serviceId
					);
					return false;
				}
				
				const override = component.client.overrideSettings;
				
				if(override.forcePlainHandshake && !protocol.tlsClientRequired){
					this.doClientWrap = false;
					this.doClientUnwrap = false;
				}else//
				if(!this.handshakeData){
					if(protocol.tlsClientRequired){
						return 0x64;
					}
					if(!override.allowPlainHandshake){
						return 0x64;
					}
					
					this.doClientWrap = false;
					this.doClientUnwrap = false;
				}else{
					this.doClientWrap = true;
					this.doClientUnwrap = protocol.tlsClientUnwrap;
				}
				
				this.doServerWrap = protocol.tlsServerWrap;
				
				return true;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackTunnelDial:executeCallback: %s, %s", this.group, this.cookie);
				TcpConnect(
					this.targetAddr, 
					this.targetPort, 
					this.connectCallback.bind(this, component),
					CONNECT_CONFIGURATION
				);
			}
		},
		"connectCallback" : {
			value : function(component, socket){
				if(!socket){
					console.log("ndm.client::CallbackTunnelDial:connectCallback: tcp connect failed: %s:%s", this.targetAddr, this.targetPort);
					return;
				}
				
				console.log("ndm.client::CallbackTunnelDial:connectCallback: tcp connected, %s:%s %s", this.targetAddr, this.targetPort, this.tunnelType);

				if(this.doClientWrap){
					console.log("ndm.client::CallbackTunnelDial:connectCallback: wrap client socket (TLS), tunnelProtocol: %s, %s", this.tunnelProtocol, this.socket);
					socket = SslWrapClient(socket, null, this.targetAddr, this.targetPort, null);
				}
				
				const output = Format.sprintf(
					"GET /%s HTTP/1.1\r\n" +
					"Host: %s\r\n" +
					"Connection: Upgrade\r\n" + 
					"Upgrade: ndm-tunnel\r\n" +
					"Content-Length: 0\r\n" +
					"X-Session-Host: %s\r\n" +
					"X-Session-Token: %s\r\n" +
					"\r\n",
					this.targetPath,
					this.targetAddress,
					component.client.ndmpHost,
					this.sessionToken
				);

				const parser = new HttpReplyParser();
				parser.callback = this.replyCallback.bind(this);
				socket.source.connectTarget(parser);
				
				socket.target.absorbBuffer(TransferCreateBufferUtf8(output));
				socket.target.force();
				this.socket = socket;
				console.log("ndm.client::CallbackTunnelDial:connectCallback: request sent: socket: %s, length: %s", socket, output.length);
				return;
			}
		},
		"replyCallback" : {
			value : function(reply){
				if(!reply){
					console.log("ndm.client::CallbackTunnelDial:replyCallback: no reply");
					this.socket.close();
					return;
				}
				switch(reply.code){
				case 101: {
					console.log("ndm.client::CallbackTunnelDial:replyCallback: switch protocol, reply: %s, %s", Format.jsDescribe(reply), this.socket);

					if(this.doClientUnwrap){
						console.log("ndm.client::CallbackTunnelDial:connectCallback: unwrap client socket (TLS), tunnelProtocol: %s, %s", this.tunnelProtocol, this.socket);
						this.socket = SslUnwrap(this.socket);
					}

					if(this.doServerWrap){
						console.log("ndm.client::CallbackTunnelDial:replyCallback: wrap server socket (TLS), tunnelProtocol: %s, %s", this.tunnelProtocol, this.socket);
						this.socket = SslWrapServer(//
							this.socket, //
							ae3.net.ssl.getDomainStore(//
								this.anchorName + "." + this.domainName, //
								CallbackTunnelDial.PROTOCOLS, //
								CallbackTunnelDial.CIPHERS//
							)//
						);
					}

					this.server = new HttpServerParser( //
							this.socket, //
							this.requestCallback.bind(this), //
							this.doServerWrap, //
							HTTP_CONFIGURATION //
					);
					console.log("ndm.client::CallbackTunnelDial:replyCallback: http server connected, %s", this.server);
					return;
				}
				}
				console.log("ndm.client::CallbackTunnelDial:replyCallback: reply: %s", Format.jsDescribe(reply));
				this.socket.close();
				return;
			}
		},
		"requestCallback" : {
			value : function(query){
				if(query && this.clientAddress) {
					query = query//
						.addAttribute("Secure", this.isSecure) //
						.setSourceAddress(this.clientAddress) //
						.addAttribute("X-Debug", "through ndm.client::ndmp::tunnelDial") //
						.addAttribute("X-Real-IP", this.clientAddress) //
						.addAttribute("X-Forwarded-For", this.clientAddress + "," + this.socket.remoteAddress) //
						.addAttribute("X-WebUI-CDN-URI", this.client.webuiCdn) //
					;
				}
				console.log("ndm.client::CallbackTunnelDial:requestCallback: web request: %s", Format.jsDescribe(query));
				return ae3.web.WebInterface.dispatch(query);
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
				// "SSL_RSA_WITH_RC4_128_MD5",
				// "SSL_RSA_WITH_RC4_128_SHA",
				// "SSL_RSA_EXPORT_WITH_RC4_40_MD5",
				// "SSL_RSA_EXPORT_WITH_DES40_CBC_SHA"
				
				// "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384", // RSA key only
				"TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
				"TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384",
				"TLS_RSA_WITH_AES_256_CBC_SHA256",
				// "TLS_ECDH_ECDSA_WITH_AES_256_CBC_SHA384", // RSA key only
				"TLS_ECDH_RSA_WITH_AES_256_CBC_SHA384",
				
				// "TLS_DHE_RSA_WITH_AES_256_CBC_SHA256", // insecure
				// "TLS_DHE_DSS_WITH_AES_256_CBC_SHA256", // insecure
				
				// "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA", // RSA key only
				"TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
				// "TLS_ECDH_ECDSA_WITH_AES_256_CBC_SHA", // RSA key only
				"TLS_ECDH_RSA_WITH_AES_256_CBC_SHA",
				"TLS_RSA_WITH_AES_256_GCM_SHA384",
				// "TLS_RSA_WITH_AES_256_CBC_SHA", // blocks FS with IE, disabled until SERVER_ORDER in jdk8
				
				"TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256",
				// "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA", // RSA key only
				"TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
				"TLS_RSA_WITH_AES_128_CBC_SHA256",
				"TLS_RSA_WITH_AES_128_GCM_SHA256",
				// "TLS_ECDH_ECDSA_WITH_AES_128_CBC_SHA",  // RSA key only
				"TLS_ECDH_RSA_WITH_AES_128_CBC_SHA",
				// "TLS_RSA_WITH_AES_128_CBC_SHA", // IE8-10 prefers it otherwise

				// "TLS_DHE_RSA_WITH_AES_256_CBC_SHA", // old OpenSSL - insecure
				// "TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA", // IE - DSS key - insecure and no DSS key
				
				// "TLS_RSA_WITH_3DES_EDE_CBC_SHA", // 112 bit, for IE8/XP, makes others choose it, disabled until SERVER_ORDER in jdk8
				// "SSL_RSA_WITH_3DES_EDE_CBC_SHA", // 112 bit, for IE8/XP, makes others choose it, disabled until SERVER_ORDER in jdk8
				
				// "TLS_ECDHE_ECDSA_WITH_3DES_EDE_CBC_SHA", // RSA key only
				// "TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA", // obsolete
				
				// "TLS_DHE_RSA_WITH_AES_128_CBC_SHA", // insecure
				
				// "TLS_DHE_RSA_WITH_3DES_EDE_CBC_SHA", // insecure: Android2, OpenSSL0.9, Safari5 
				// "SSL_DHE_RSA_WITH_3DES_EDE_CBC_SHA", // insecure: Android2, OpenSSL0.9, Safari5 
			]
		}
	}
);
