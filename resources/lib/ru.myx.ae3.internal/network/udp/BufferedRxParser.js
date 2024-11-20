const ae3 = require('ae3');
const Transfer = ae3.Transfer;
const FN_FORMAT_BINARY_AS_HEX = Format.binaryAsHex;

/**
 * 
 * <ol>Supposed to be bint:
 * <li>this - UdpService instance</li>
 * <li>b - buffer = new ArrayBuffer(1500)</li>
 * <li>d - digest = new WhirlpoolDigest()</li>
 * </ol>
 * 
 * <ol>Live arguments:
 * <li>q - queue, not bint, called as buffered method</li>
 * </ol>
 * 
 * <ol>Local variables:
 * <li>pkt - packet</li>
 * <li>load - payload</li>
 * <li>key</li>
 * <li>peer</li>
 * <li>crc</li>
 * <li>m - messageClass</li>
 * <li>l - length</li>
 * <li>ms - messageSerial</li>
 * <li>msg - message</li>
 * </ol>
 */


const onReceiveBufferImpl = module.exports = function(b, d, q /* locals: */, pkt, load, key, peer, crc, m, l, ms, msg){
	++ this.stRxLoops;
	
	for(;;){
		pkt = q.shift();
		if(!pkt){
			return;
		}
		
		// arguments object
		pkt = pkt[0];

		++ this.stRxCount;
		load = pkt.payLoad;
		
		// command + serial
		load.copy(16 + 12, b, 0, 4);

		m = this.commandByKey[b[0] & 0xFF];
		if(!m){
			console.log('>>>>>> udp-read-skip: %s, %s, unsupported command, code: %s%s', 
				this, 
				pkt, 
				b[0], 
				(b[0] > 32 && b[0] < 128 ? ', ascii: ' + String.fromCharCode(b[0]) : '')
			);
			++ this.stRxSkip;
			continue;
		}
		
		key = load.slice(16, 12);

		peer = this.resolvePeer(key);
		if(false /* && !peer && this.resolveClientAsync */){
			/**
			console.log('>>> >>> udp-read-resolve-client: peer: %s, %s <- @ %s:%s', 
				FN_FORMAT_BINARY_AS_HEX(key), 
				m.toString(), 
				pkt.sourceAddress.address, 
				pkt.sourceAddress.port
			);
			**/
			// continue;
			
			this.resolveClientAsync(key, m, pkt);
			continue;
		}
		if(!peer){
			console.log('>>>>>> udp-read-client-unknown: %s, peer: %s, %s : sign: %s, addr: %s:%s', 
				this, 
				FN_FORMAT_BINARY_AS_HEX(key), 
				m.toString(), 
				Format.jsObject(load.slice(0, 16)),
				pkt.sourceAddress.address.hostAddress, 
				pkt.sourceAddress.port
			);
			continue;
		}

		ms = ((b[1] & 0xFF) << 16) | ((b[2] & 0xFF) << 8) | (b[3] & 0xFF);
		if(ms <= peer.sRx){
			console.log('>>>>>> udp-read-skip-serial: peer: %s, message serial: %s, peer serial: %s, addr: %s:%s', 
				peer.keyHex,
				ms, 
				peer.sRx,
				pkt.sourceAddress.address.hostAddress, 
				pkt.sourceAddress.port
			);
			++ this.stRxSkip;
			continue;
		}
		
		if(!peer.secret){
			console.log('>>>>>> udp-read-skip-secret: peer: %s, secret is not set, addr: %s:%s', 
				peer.keyHex,
				pkt.sourceAddress.address.hostAddress, 
				pkt.sourceAddress.port
			);
			++ this.stRxSkip;
			continue;
		}
		
		switch( (msg = (m.prototype.isRequest ? peer.checkRxqSerial(ms) : peer.checkRxrSerial(ms))) ){
		case true:
			console.log('>>>>>> udp-read-skip-ignore: peer: %s, rejected by peer, serial: %s, addr: %s:%s', 
				peer.keyHex,
				ms, 
				pkt.sourceAddress.address.hostAddress, 
				pkt.sourceAddress.port
			);
			++ this.stRxSkip;
			continue;
		}
		
		crc = d.clone();
		load.slice(16, load.length() - 16).updateMessageDigest(crc);
		peer.secret.updateMessageDigest(crc);
		crc = Transfer.wrapCopier(crc.result, 0, 16);
		
		if(load.slice(0, 16) != crc){
			console.log('>>>>>> udp-read-crc-fail: peer: %s, crc mismatch, %s : %s != %s', 
				peer.keyHex,
				m.toString(), 
				Format.jsObject(load.slice(0, 16)), 
				Format.jsObject(crc)
			);
			++ this.stCrcFail;
			continue;
		}
		
		if(msg){
			if(msg.isReply /** m.prototype.isRequest */){
				/** TODO: send pre-cached replies using peer.sendUdp */
				console.log('>>>>>> udp-read-send-repeat: reply re-sent by peer %s: serial: %s, addr: %s:%s', 
					peer.keyHex,
					ms, 
					pkt.sourceAddress.address.hostAddress, 
					pkt.sourceAddress.port
				);
				++ this.stRxSkip;
				continue;
			}
		}
		
		l = load.length() - 32;
		
		if(m.prototype.encrypt){
			peer.payloadDecrypt(load, b, 0, l, d);
		}else{
			load.copy(32, b, 0, l);
		}

		msg = m.parseBinaryMessage(b, 0, ms, l);
		
		if(!msg){
			console.log('>>>>>> udp-read-bad-body: peer: %s, invalid payload rejected, %s, serial: %s, packetLen: %s', 
				peer.keyHex, 
				m.toString(), 
				ms, 
				load.length()
			);
			++ this.stBadBody;
			continue;
		}

		/*
		console.log('>>> >>> udp-read: %s @ %s:%s, len: %s, serial: %s, %s',
			peer.keyHex,
			pkt.sourceAddress.address.hostAddress, 
			pkt.sourceAddress.port,
			load.length(),
			ms,
			msg.toString() 
		);
		*/

		peer.onReceive(msg, pkt.sourceAddress, ms);
	}
};
