const MsgSeen = module.exports = require('ae3').Class.create(
	/* name */
	"MsgSeen",
	/* inherit */
	require('./Message').ReplyFinal,
	/* constructor */
	function(serial, port, mode){
		// this.MessageReplyFinal();
		this.serial = serial;
		this.port = port;
		this.mode = mode;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x38 // '8'.charCodeAt(0)
		},
		isUHP_FROM_SERVER : {
			value : true
		},
		isUHP : {
			value : true
		},
		isSEEN : {
			value : true
		},
		parseMode : {
			value : function(target){
				return MsgSeen.parseMode(this.mode, target);
			}
		},
		build : {
			value : function(b, o){
				// 2 bytes length, port
				b[o++] = (this.port & 0xFF00) >> 8;
				b[o++] = this.port & 0x00FF;
				// 1 byte more
				b[o++] = this.mode;
				return 3;
			}
		},
		toString : {
			value : function(){
				return "[MsgSeen serial:" + this.serial + ", port:" + this.port + ", mode:0x" + this.mode.toString(16) + "]";
			}
		}
	},
	/* static */
	{
		"parse" : {
			value : function(b, o, s){
				return new MsgSeen(
					// serial
					s,
					// port
					(((b[o++] & 0xFF) << 8) + (b[o++] & 0xFF)),
					// mode
					b[o++] & 0xFF
				);
			}
		},
		"parseMode" : {
			value : function(mode, target){
				if('number' !== typeof mode || mode > 255 || mode < 0){
					throw 'Invalid mode: ' + Format.jsObject(mode);
				}
				if(mode){
					target.loopInterval = (mode & 0x1F) * 4 + 1;
					target.loopLimit = ((mode & 0xE0) >> 5) * 2 + 1;
				}
				return mode;
			}
		},
		"toString" : {
			value : function(){
				return "MsgSeen";
			}
		}
	}
);
