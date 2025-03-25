const ae3 = require("ae3");

const TaskEvent = module.exports = ae3.Class.create(
	"TaskEvent",
	undefined,
	function(elapsed, origin, type, variant, peer, detail){
		this.elapsed = elapsed;
		this.origin = String(origin);
		this.type = type;
		this.hl = variant;
		this.peer = String(peer);
		this.detail = String(detail);
	},
	{
		toString : {
			value : function(){
				return [this.origin, " ", this.type, " ", this.hl, ": ", this.peer, ": ", this.detail].join("");
			}
		}
	}
);
