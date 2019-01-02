function PresetMininal(name){
	this.name = name;
	return this;
}

Object.defineProperties(PresetMininal.prototype, {
	PresetMininal : {
		value : PresetMininal
	},
	populate : {
		value : function(map){
			map[this.name] = this;
		}
	},
	filter : {
		value : function(descriptor){
			return false;
		}
	}
});

function PresetComplete(){
	return this;
}

PresetComplete.prototype = Object.create(PresetMininal.prototype, {
	PresetComplete : {
		value : PresetComplete
	},
	name : {
		value : 'complete'
	},
	filter : {
		value : function(descriptor){
			return true;
		}
	}
});

const PRESETS = {};

new PresetMininal('minimal').populate(PRESETS);
new PresetComplete().populate(PRESETS);

const Distro = {
	listAllPresets : function(){
		return PRESETS.values();
	},
	listAllPackages : function(){
		return this.listPackagesForPreset('complete');
	},
	listPackagesForPreset : function(preset){
		preset.PresetMinimal || (preset = PRESETS[preset]);
		if(!preset){
			throw 'Unknown Preset!';
		}
	},
};


module.exports = Distro;