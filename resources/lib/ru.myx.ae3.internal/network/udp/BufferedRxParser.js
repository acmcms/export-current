const ae3 = require('ae3');
const Transfer = ae3.Transfer;

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
 * <li>load</li>
 * <li>key</li>
 * <li>peer</li>
 * <li>crc</li>
 * <li>m - messageClass</li>
 * <li>l - length</li>
 * <li>ms - messageSerial</li>
 * <li>msg - message</li>
 * </ol>
 */


module.exports = function onReceiveBufferImpl(b, d, q, pkt, load, key, peer, crc, m, l, ms, msg){
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
			// console.log('>>> >>> udp-read-skip: %s, %s', this, Format.jsDescribe(this.commandByKey));
			console.log('>>>>>> udp-read-skip: %s, %s, code: %s%s', this, pkt, b[0], (b[0] > 32 && b[0] < 128 ? ', ascii: ' + String.fromCharCode(b[0]) : ''));
			++ this.stRxSkip;
			continue;
		}
		
		key = load.slice(16, 12);

		peer = this.resolvePeer(key);
		if(false /* && !peer && this.resolveClientAsync */){
			// console.log('>>>>>> udp-read-resolve-client: %s <- %s @ %s:%s', m.toString(), Format.jsObject(key), pkt.sourceAddress.address, pkt.sourceAddress.port);
			// continue;
			
			this.resolveClientAsync(key, m, pkt);
			continue;
		}
		if(!peer){
			console.log('>>>>>> udp-read-client-unknown: %s, %s <- %s : sign: %s, addr: %s:%s', 
				this, 
				m.toString(), 
				Format.jsObject(key), 
				Format.jsObject(load.slice(0, 16)),
				pkt.sourceAddress.address.hostAddress, 
				pkt.sourceAddress.port
			);
			continue;
		}

		ms = ((b[1] & 0xFF) << 16) | ((b[2] & 0xFF) << 8) | (b[3] & 0xFF);
		if(ms <= peer.sRx){
			console.log('>>>>>> udp-read-skip-serial: message serial: %s, peer serial: %s, addr: %s:%s', 
				ms, 
				peer.sRx,
				pkt.sourceAddress.address.hostAddress, 
				pkt.sourceAddress.port
			);
			++ this.stRxSkip;
			continue;
		}
		
		if(!peer.secret){
			console.log('>>>>>> udp-read-skip-secret: peer secret is not set: %s, addr: %s:%s', 
				Format.jsObject(peer.key),
				pkt.sourceAddress.address.hostAddress, 
				pkt.sourceAddress.port
			);
			++ this.stRxSkip;
			continue;
		}

		if(peer.isIgnoreSerial(ms)){
			console.log('>>>>>> udp-read-skip-repeat: rejected by peer %s: serial: %s, addr: %s:%s', 
				Format.jsObject(peer.key),
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
			console.log('>>>>>> udp-read-crc-fail: %s <- %s : %s != %s', m.toString(), Format.jsObject(key), Format.jsObject(load.slice(0, 16)), Format.jsObject(crc));
			++ this.stCrcFail;
			continue;
		}
		
		l = load.length() - 32;
		
		if(m.prototype.encrypt){
			peer.payloadDecrypt(load, b, 0, l, d);
		}else{
			load.copy(32, b, 0, l);
		}

		msg = m.parse(b, 0, ms, l);
		
		if(!msg){
			console.log('>>>>>> udp-read-bad-body: invalid payload rejected, %s <- %s, serial: %s, packetLen: %s', m.toString(), Format.jsObject(key), ms, load.length());
			++ this.stBadBody;
			continue;
		}

		/*
		console.log('>>> >>> udp-read: %s @ %s:%s, len: %s, serial: %s, %s', 
			Format.jsObject(key), 
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
