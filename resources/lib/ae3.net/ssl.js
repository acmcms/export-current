import ru.myx.ae3.transfer.tls.TlsPack;

import ru.myx.ae3.binary.TransferSocket;
import ru.myx.ae3.binary.TransferSource;
import ru.myx.ae3.binary.TransferTarget;



module.exports = Object.create(Object.prototype, {
	/**
	 * classes
	 */
	TcpSocket : {
		enumerable : true,
		value : TransferSocket
	},
	TcpSource : {
		enumerable : true,
		value : TransferSource
	},
	TcpTarget : {
		enumerable : true,
		value : TransferTarget
	},
	
	/**
	 * Wraps SSL over the Socket argument, sets up for the Client mode
	 * 
			final TransferSocket source,
			final DomainStore store, // null for default
			final String peerHost,
			final int peerPort,
			final String trustRoot
	 */
	wrapClient : {
		enumerable : true,
		value : TlsPack.wrapClient/* function(socket, store, peerHost, peerPort[, trustRoot]){} */
	},
	/**
	 * Wraps SSL over the Socket argument, sets up for the Server mode
	 * 
			final TransferSocket source,
			final DomainStore store, // null for default
	 */
	wrapServer : {
		enumerable : true,
		value : TlsPack.wrapServer/* function(socket, store){} */
	},
	getDomainStore : {
		enumerable : true,
		value : TlsPack.getDomainStore/* function(fqdn, protocols, ciphers){} */
	},
	
	EllipticCurveSecp256r1 :{
		enumerable : true,
		value : require("java.class/ru.myx.crypto.EllipticCurveSecp256r1")
	},
	
	"toString" : {
		value : function(){
			return "[Object ae3.net.ssl API]";
		}
	}
});
