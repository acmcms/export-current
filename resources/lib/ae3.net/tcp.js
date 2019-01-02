import ru.myx.ae3.transfer.nio.NioPack;

import ru.myx.ae3.binary.TransferSocket;
import ru.myx.ae3.binary.TransferSource;
import ru.myx.ae3.binary.TransferTarget;



module.exports = {
	/**
	 * classes
	 */
	TcpSocket : TransferSocket,
	TcpSource : TransferSource,
	TcpTarget : TransferTarget,
	
	SOCK_MAXED_OUT : -1,
	SOCK_THE_LEAST : 0,
	
	SOCK_FAST_READ : 0x11,
	SOCK_FAST_SEND : 0x22,
	SOCK_BANDWIDTH : 0x33,
	
	SOCK_CLIENT_OP : 0x01,
	SOCK_SERVER_OP : 0x02,
	
	/**
	 * tcp connect
	 * 
	 * callbackFn(socket)
	 * 
	 * socket is NULL if connection failed
	 * 
	 * socket is the object that is Socket, Source & Target simultaneously
	 * 
	 */
	connect : NioPack.connect /* function(address, port, callbackFn){} */,
	
	/**
	 * 
	 */
	listen : NioPack.listen /* function(address, port, callbackFn){} */,
	
	
	"toString" : function(){
		return "[Object ae3.net.tcp API]";
	} 
};
