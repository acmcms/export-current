const os = require('os');
const Reply = require('ae3').Reply;

import ru.myx.ae3.skinner.SkinScanner;
import ru.myx.ae3.i3.web.WebInterface;


const getSettings = require('ae3.util/Settings').SettingsBuilder.builderCachedLazy()//
	.setInputFolderPath("settings/web/hosts")//
	.setDescriptorReducer(function(settings, description){
		if (description.type !== "ae3.web/Share" && description.type !== "ae3.WebShare") {
			return settings;
		}
		
		var reference = description.reference;
		if(!reference){
			return settings;
		}
		
		const name = description.name;

		settings.others || (settings.others = {});
		settings.shares || (settings.shares = Object.create(settings.others));
		settings.prefix || (settings.prefix = {});

		'string' === typeof reference && (reference = { type : 'require', reference : reference });

		const aliases = Array(description.aliases);
		
		const mapping = {
			name : name,
			aliases : aliases,
			reference : reference
		};
		
		const hostname = os.hostname();
		var i;

		for(i = -1;;){
			if(name.includes('*')){
				if(name.startsWith("*.")) {
					name = name.substr(2);
					mapping.maxSubs = 1;
				} else //
				if(name.startsWith("**.")) {
					name = name.substr(3);
					mapping.maxSubs = Number.MAX_VALUE;
				} else {
					mapping.maxSubs = 0;
				}
				
				if(name.endsWith(".*")) {
					/**
					 * with a dot in the end
					 */
					name = name.substr(0, name.length - 1);
					if(hostname.startsWith(name)){
						settings.others[hostname] = mapping;
					}else{
						settings.others[name + hostname] = mapping;
					}
					settings.others[name + 'local'] = mapping;
				}else
				if(name.endsWith(".**")) {
					/**
					 * with a dot in the end
					 */
					name = name.substr(0, name.length - 2);
					if(hostname.startsWith(name)){
						settings.others[hostname] = mapping;
					}else{
						settings.others[name + hostname] = mapping;
					}
					settings.others[name + 'local'] = mapping;
					settings.prefix[name] = mapping;
				}else{
					settings.others[name] = mapping;
				}
			}else{
				mapping.maxSubs = 0;
				settings.shares[name] = mapping;
			}
			
			if(++i >= aliases.length){
				break;
			}
			name = aliases[i];
		}
		
		
		return settings;
	})//
	.buildGetter()
;





function SkinHandler(name){
	this.name = name;
	this.skin = SkinScanner.getContextSkinner(name);
	this.Share();
	return this;
}

SkinHandler.prototype = Object.create(require('ae3.web/Share').prototype, {
	onHandle : {
		value : function(context){
			return Request.querySkin(0, this.skin, context.query);
		}
	},
	toString : {
		value : function(){
			return "[object SkinHandler(" + Format.jsString(this.name) + ")]";
		}
	}
});

function RedirectHandler(target){
	this.target = target;
	this.Share();
	return this;
}

RedirectHandler.prototype = Object.create(require('ae3.web/Share').prototype, {
	onHandle : {
		value : function(context){
			return Reply.redirect('share-redirect', context.query, true, this.target);
		}
	},
	toString : {
		value : function(){
			return "[object RedirectHandler(" + Format.jsString(this.target) + ")]";
		}
	}
});

const internReturnUndefined = {
	onHandle : function(){
		return undefined;
	},
	toString : {
		value : function(){
			return "[object ReturnUndefinedHandler]";
		}
	}
};





function HostRouter(){
	return this;
}

HostRouter.prototype = {
	"getReplyOrUndefined" : function(context) {
		return ( this.getHandlerForHost(context.query.target) || internReturnUndefined ).onHandle(context);
	},
	"getHandlerForHost" : function(target) {
		var settings = getSettings();
		if(!settings.shares){
			return undefined;
		}
		var description = settings.shares[target];
		var level = 0, pos;
		if(!description){
			pos = target.indexOf('.');
			if (pos === -1) {
				return undefined;
			}
			// including the trailing dot
			description = settings.prefix[target.substr(0, pos + 1)];
			if(!description){
				++level;
				description = settings.shares[target = target.substr(pos + 1)];
			}
		}
		var reference;
		for (;; ++level) {
			if (description && level <= description.maxSubs) {
				if(description.instance){
					return description.instance;
				}
				/**
				 * We got our handler description identified
				 */
				reference = description.reference;
				switch(reference.type || reference['class']){
				case 'require':
					return description.instance = require(reference.reference);
				case 'produce':
					switch(reference.factory){
					case 'require':{
						const argument = require(reference.argument);
						switch(typeof reference.settings){
						case 'undefined':
							return description.instance = new argument();
						default:
							return description.instance = new argument(reference.settings);
						}
					}
					default:
						throw "Unsupported factory: " + Format.jsDescribe(reference);
					}
				case 'skin':
					return description.instance = new SkinHandler(reference.skin);
				case 'alias':{
					const referent = WebInterface.dispatcherForTarget(reference.alias);
					return description.instance = referent.getWaitRealTarget
						? referent.getWaitRealTarget()
						: referent;
				}
					// return description.instance = WebInterface.dispatcherForTarget(reference.alias).getWaitRealTarget();
					// return description.instance = this.getHandlerForHost(reference.alias);
				case 'redirect':
					return description.instance = new RedirectHandler(reference.target);
				}
				throw "Unknown share type: " + Format.jsDescribe(reference);
				// return require(reference);
			}
			pos = target.indexOf('.');
			if (pos === -1) {
				return undefined;
			}
			description = settings.shares[target = target.substr(pos + 1)];
		}
		return undefined;
	}
};

HostRouter.getReplyOrUndefined = HostRouter.prototype.getReplyOrUndefined;
HostRouter.getHandlerForHost = HostRouter.prototype.getHandlerForHost;

module.exports = HostRouter;