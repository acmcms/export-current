const ae3 = require('ae3');
const Transfer = ae3.Transfer;

const UdpServiceHelper = (function(){ try{ return require('java.class/ru.myx.ae3.internal.net.UdpServiceHelper'); }catch(e){ return {}; } })();

/**
 * FIXME: implement build
 */
const MsgRsst = module.exports = ae3.Class.create(
	/* name */
	"MsgRsst",
	/* inherit */
	require('./Message').Request,
	/* constructor */
	/**
	 * 
	 * @param rsst binary
	 * @returns {@G}
	 */
	function MsgRsst(rsst, serial){
		// this.MessageRequest();
		this.rsst = rsst || [ 0x40, 0x05, 0x34, 0x00 ]; // '4'
		this.serial = serial;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x34 // '4'.charCodeAt(0)
		},
		encrypt : {
			value : true
		},
		build : {
			value : /* UdpServiceHelper.buildMsgRsst || */ (function(b, o){
				// 2 bytes 0x4005
				b[o++] = 0x40;
				b[o++] = 0x05;
				// 2 bytes, '4' string
				b[o++] = 0x34;
				b[o++] = 0x00;

				return 2+2;

				return this.rsst.copy(0, b, o, 1280);
			})
		},
		toString : {
			value : function(){
				if(!this.rsst){
					return "[MsgRsst "+", sTx:"+(this.serial||0)+"]";
				}
				return "[MsgRsst "+Format.bytesRound(this.rsst.length()) + "B, sTx:"+(this.serial||0)+"]";
			}
		}
	},
	/* static */
	{
		"parse" : {
			value : function(b, o, s, L){
				return new MsgRsst(Transfer.createCopier(b, o, L), s);
			}
		},
		"toString" : {
			value : function(){
				return "MsgRsst";
			}
		}
	}
);
