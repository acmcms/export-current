import ru.myx.ae3.produce.Produce;
import ru.myx.ae3.flow.ObjectTarget;

function requireHTTPD(){
	
	require('java.class/ru.myx.ae3.i3.web.http.Main').main( null );
	require('java.class/ru.myx.ae3.i3.web.telnet.Main').main( null );
	
	require('java.class/ru.myx.iface.logger.Main').main( null );
	require('java.class/ru.myx.iface.ssh.Main').main( null );
	
	require('java.class/ru.myx.renderer.tpl.Main').main( null );
	require('java.class/ru.myx.ae3impl.skinner.Main').main( null );
	
	// assert SkinScanner.getSystemSkinner( "skin-standard-html" ) != null;
	// assert SkinScanner.getSystemSkinner( "skin-jsclient" ) != null;
}

function startWeb(){
	import ru.myx.ae3.i3.web.WebInterface;
	var target = new WebInterface();
	return target && //
	Produce.connectLeast("HTTP", target, //
		// filter array
		[ //
			{ //
				factory : 'MODIFY',
				attribute : {
					key : 'Secure',
					value : false
				}
			}, //
			{ //
				factory : 'GEO'
			}, //
			{ //
				factory : 'FASTREPLY'
			}, //
			{ //
				factory : 'HTTP',
				ignoreTargetPort : false,
				ignoreGzip : false,
				ignoreKeepAlive : false,
				reverseProxied : false
			} //
		], //
		"ACCEPT",
		// source attributes
		{ //
			host : '*', //
			port : 80 //
		} //
	) && //
	Produce.connectLeast("HTTP", target, //
			// filter array
			[ //
				{
					factory	: 'POOL',
					limit	: 32,
					queue	: 256,
					timeout	: '10s'
				},
				{ //
					factory : 'GEO'
				}, //
				{ //
					factory : 'FASTREPLY'
				}, //
				{ //
					factory : 'HTTP',
					ignoreTargetPort : true,
					ignoreGzip : false,
					ignoreKeepAlive : false,
					reverseProxied : true
				} //
			], //
			"ACCEPT",
			// source attributes
			{ //
				host : '*', //
				port : 81 //
			} //
		) && //
	Produce.connectLeast("HTTPS", target,
		// filter array
		[ //
			{
				factory	: 'POOL',
				limit	: 32,
				queue	: 512,
				timeout	: '20s'
			},
			{ //
				factory : 'MODIFY',
				attribute : {
					key : 'Secure',
					value : true
				}
			}, //
			{ //
				factory : 'GEO'
			}, //
			{ //
				factory : 'FASTREPLY'
			}, //
			{ //
				factory : 'HTTPS',
				ignoreTargetPort : false,
				ignoreGzip : false,
				ignoreKeepAlive : false,
				reverseProxied : false
			}, //
			{ //
				factory : 'TLS',
				cipher : [ 
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
			} //
		], //
		"ACCEPT", //
		// source attributes
		{ //
			host : '*', //
			port : 443 //
		} //
	) && //
	true;
}

function startTelnet(){
	var target = Produce.object(ObjectTarget, "TELNET", null, null);
	return target && //
	Produce.connectLeast("TELNET", target, //
		// filter array
		null, //
		"ACCEPT",
		// source attributes
		{ //
			host : '*', //
			port : 23 //
		} //
	) && //
	true;
}

function startSsh(){
	var target = Produce.object(ObjectTarget, "SSH", null, null);
	return target && //
	Produce.connectLeast("SSH", target, //
		// filter array
		null, //
		"ACCEPT",
		// source attributes
		{ //
			host : '*', //
			port : 22 //
		} //
	) && //
	true;
}

function startDmesg(){
	var target = Produce.object(ObjectTarget, "DMESG", null, null);
	return target && //
	Produce.connectLeast("DMESG", target, //
		// filter array
		null, //
		"ACCEPT",
		// source attributes
		{ //
			host : '*', //
			port : 24 //
		} //
	) && //
	true;
}

exports.start = function start() {
	try{
		require("ru.acmcms.internal/Dummy");
		require("java.class/java.lang.System").out.println("WEB-SERVICE: acmcms detected, no default initialization");
		return true;
	}catch(e){
		// ignore: fall-through
	}
	requireHTTPD();
	if(startWeb() && startTelnet() && startSsh() && startDmesg()){
		return true; 
	}
	throw "fuck";
};