function StatsGroup(descriptor){
	this.accessed = Date.now();
	this.descriptor = descriptor;
	return this;
}



function internReduce(result, current){
	var k, t, T, s, S;
	
	t = result.columns;
	s = current.columns;
	T = result.values;
	S = current.values;

	for keys(k in s){
		t[k] = s[k];
		T[k] = S[k];
	}
	return result;
}



Object.defineProperties(StatsGroup.prototype, {
	key : {
		get : function(){
			return this.descriptor.name;
		}
	},
	title : {
		get : function(){
			return this.descriptor.title || this.descriptor.name;
		}
	},
	extra : {
		get : function(){
			return this.descriptor.extra;
		}
	},
	columns : {
		/**
		 * lazy field initializer
		 */
		get : function(){
			const result = [];
			var temp = require(this.descriptor.reference);
			for(temp of temp.columns){
				result.push(temp);
			}
			if(this.descriptor.extra){
				for(temp of Array.prototype.slice.call(this.descriptor.extra.values()).sort(function(x,y){
					return x.key > y.key ? 1 : x.key === y.key ? 2 : -1;
				})){
					result = result.concat(temp.columns);
				}
			}
			return this.columns = result;
		}
	},
	getColumns : {
		value : function(filter){
			/**
			 * TODO: implement column filter by keyword
			 */
			return this.columns;
		}
	},
	hasKeyword : {
		value : function(keyword){
			if(!keyword){
				return true;
			}
			var own = this.descriptor.keywords;
			if(!own){
				return false;
			}
			if(own === '*'){
				return true;
			}
			if(own === keyword){
				return true;
			}
			if(Array.isArray(own)){
				/**
				if(Array.isArray(keyword)){
					
				}
				 **/
				for(var o of own){
					if(o === keyword){
						return true;
					}
				}
				return false;
			}
			return false;
		}
	},
	rawValues : {
		get : function(){
			var impl = require(this.descriptor.reference);
			var columns = impl.columns;
			return {
				columns : impl.columns,
				values : impl.getValues()
			};
		}
	},
	readOwnValues : {
		value : function(previous, filter){
			var impl = require(this.descriptor.reference);
			var columns = impl.columns;
			var values = impl.getValues(previous);
			this.accessed = Date.now();

			var column, evaluate, other, name;
			
			if(filter){
				other = {};
				for(column of columns){
					name = column.name;
					Object.defineProperty(other, name, {
						value : values[name],
						enumerable : column[filter],
						writable : true,
						configurable : true
					});
				}
				values = other;
			}
			
			for(column of columns){
				name = column.name;
				evaluate = column.evaluate;
				if(evaluate){
					switch(evaluate.type){
					case 'delta':{
						other = columns[evaluate.reference];
						Object.defineProperty(values, name, {
							value : Number(values[other.name] || 0) - Number(previous[other.name] || 0),
							enumerable : !filter || column[filter],
							writable : true,
							configurable : true
						});
						break;
					}
					default:
						continue;
					}
				}
			}
			return {
				columns : columns,
				values : values
			};
		}
	},
	readValues : {
		value : function(previous, filter){
			var temp = this.readOwnValues(previous, filter);
			if(this.descriptor.extra){
				temp = internReduce({ columns : {}, values : {} }, temp);
				for(var extra of this.descriptor.extra){
					internReduce(temp, extra.readOwnValues(previous, filter));
				}
			}
			return temp;
		}
	},
	runCollect : {
		value : function(previous){
			var temp = this.readValues(previous);
			var columns = temp.columns;
			var values = temp.values;
			
			
		}
	},
	"toString" : {
		value : function(){
			return "[object StatsGroup (" + this.key + ")]";
		}
	}
});

module.exports = StatsGroup;