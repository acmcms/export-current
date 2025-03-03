/**
 * 
 */

/**
 * try java native implementation (faster, optional)
 */
{
	try{
		import ru.myx.ae3.internal.ClassApiHelper;
		if('function' === typeof ClassApiHelper.createClass){
			console.log("createClass: java native implementation will be used.");
			module.exports = {
				"create" : ClassApiHelper.createClass
			};
			return;
		}
	}catch(e){
		// seems no helper available
	}
}

const FN_RETURN_STRING_THIS = function(){
	return this;
};

const FN_RETURN_STRING_CLASS = function(){
	return "[class]";
};

module.exports = {
	"create" : function(name, inherit, constructor, properties, statics){
		const p = constructor.prototype = inherit
			? Object.create(inherit.prototype ?? inherit)
			: {}
		;
		if(properties){
			var k, d;
			for(k in properties){
				d = properties[k];
				if(!d){
					console.warn("createClass: instance " + name + ", propertyKey: " + key + " has invalid descriptor: " + Format.jsDescribe(d));
				}else{
					if(d.execute === 'once' && 'function' === typeof d.get){
						const get = d.get;
						const key = k;
						d = Object.create(d);
						d.get = function(){
							const result = get.call(this);
							this === p || Object.defineProperty(this, key, Object.create(d, { 
								value : result,
								get : undefined 
							}));
							// console.log("createClass: instance >>>>>> once: " + name + ", " + key);
							return result;
						};
					}
					Object.defineProperty(p, k, d);
				}
			}
			// Object.defineProperties(p, properties);
		}
		if(name && !(properties?.[name])){
			Object.defineProperty(p, name, { value : constructor });
		}
		if(statics){
			var k, d;
			for(k in statics){
				d = statics[k];
				if(!d){
					console.warn("createClass: statics " + name + ", propertyKey: " + key + " has invalid descriptor: " + Format.jsDescribe(d));
				}else{
					if(d.execute === 'once' && 'function' === typeof d.get){
						const get = d.get;
						const key = k;
						d = Object.create(d);
						d.get = function(){
							const result = get.call(this);
							this === constructor && Object.defineProperty(this, key, Object.create(d, { 
								value : result,
								get : undefined 
							}));
							// console.log("createClass: statics >>>>>> once: " + name + ", " + key);
							return result;
						};
					}
					Object.defineProperty(constructor, k, d);
				}
			}
			// Object.defineProperties(constructor, statics);
		}
		if(name){
			Object.defineProperty(constructor, "name", {
				value : name
			});
		}
		if(undefined === statics?.toString){
			Object.defineProperty(constructor, "toString", {
				value : name === null || name === undefined
					? FN_RETURN_STRING_CLASS
					: FN_RETURN_STRING_THIS.bind("[class " + (name) + "]")
			});
		}
		return constructor;
	}
};
