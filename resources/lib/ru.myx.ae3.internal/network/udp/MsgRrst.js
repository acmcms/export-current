const ae3 = require('ae3');
const Transfer = ae3.Transfer;

const UdpServiceHelper = (function(){ try{ return require('java.class/ru.myx.ae3.internal.net.UdpServiceHelper'); }catch(e){ return {}; } })();


/**
 * FIXME: implement build
 */
const MsgRrst = module.exports = ae3.Class.create(
	/* name */
	"MsgRrst",
	/* inherit */
	require('./Message').Request,
	/* constructor */
	/**
	 * 
	 * @param rrst binary
	 * @returns {@G}
	 */
	function MsgRrst(rrst, serial){
		// this.MessageRequest();
		this.rrst = rrst || [ 0x40, 0x05 ];
		this.serial = serial;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x33 // '3'.charCodeAt(0)
		},
		encrypt : {
			value : true
		},
		build : {
			value : /* UdpServiceHelper.buildMsgRrst || */ (function(b, o){
				// 2 bytes 0x4005
				b[o++] = 0x40;
				b[o++] = 0x05;
				return 2;
				
				return this.rrst.copy(0, b, o, 1280);
			})
		},
		toString : {
			value : function(){
				if(!this.rrst){
					return "[MsgRrst "+", sTx:"+(this.serial||0)+"]";
				}
				return "[MsgRrst "+Format.bytesRound(this.rrst.length()) + "B, sTx:"+(this.serial||0)+"]";
			}
		}
	},
	/* static */
	{
		"parse" : {
			value : function(b, o, s, L){
				return new MsgRrst(Transfer.createCopier(b, o, L), s);
			}
		},
		"toString" : {
			value : function(){
				return "MsgRrst";
			}
		}
	}
);
