function DistroWebPresetItem(preset){
	this.DistroWebAbstract(preset);
	this.preset = preset;
	return this;
}

DistroWebPresetItem.prototype = Object.create(require('./DistroWebAbstract').prototype, {
	DistroWebPresetItem : {
		value : DistroWebPresetItem
	},
	icon : {
		get : function(){
			return this.preset.icon || "disk";
		}
	},
	link : {
		get : function(){
			return this.preset.name + '/';
		}
	},
	title : {
		get : function(){
			return this.preset.title || ("Preset: " + this.preset.name);
		}
	},
	handle : {
		value : function(context){
			const query = context.query;
		}
	},
	toString : {
		value : function(){
			return "[DistroWebPresetItem]";
		}
	}
});

module.exports = DistroWebPresetItem;
