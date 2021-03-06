const ae3 = require('ae3');
const net = ae3.net;

const UdpServiceHelper = (function(){ try{ return require('java.class/ru.myx.ae3.internal.net.UdpServiceHelper'); }catch(e){ return {}; } })();

const MsgPokeDirect = module.exports = ae3.Class.create(
	/* name */
	"MsgPokeDirect",
	/* inherit */
	require('./Message').Request,
	/* constructor */
	function(src, serial){
		// this.MessageRequest();
		this.src = src;
		this.serial = serial;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x32 // '2'.charCodeAt(0)
		},
		isUHP_PUNCH : {
			value : true
		},
		isUHP : {
			value : true
		},
		isPOKE : {
			value : true
		},
		build : {
			value : UdpServiceHelper.buildMsgPoke || (function(b, o){
				// 4 bytes length, IPv4
				const addr = this.src.address.address;
				b[o++] = addr[0];
				b[o++] = addr[1];
				b[o++] = addr[2];
				b[o++] = addr[3];
				// 2 bytes length, port
				const port = this.src.port;
				b[o++] = (port & 0xFF00) >> 8;
				b[o++] = port & 0x00FF;
				return 6;
			})
		},
		toString : {
			value : function(){
				return "[MsgPokeDirect " + this.src.address + ":" + this.src.port + "]";
			}
		}
	},
	/* static */
	{
		"isUHP" : {
			value : true
		},
		"parse" : {
			value : function(b, o, serial){
				return new MsgPokeDirect(
					net.socketAddress(
						// address
						(b[o++]&0xFF) + '.' + (b[o++]&0xFF) + '.' + (b[o++]&0xFF) + '.' + (b[o++]&0xFF) + 
						':' + 
						// port
						(((b[o++]&0xFF) << 8) + (b[o++]&0xFF))
					),
					serial
				);
			}
		},
		"toString" : {
			value : function(){
				return "MsgPokeDirect";
			}
		}
	}
);
