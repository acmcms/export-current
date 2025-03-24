import ru.myx.ae3.common.FutureSimpleBatch;

function internIterate(container, starting, ending, compare, console, callBackFn, thisValue){
	var items = 0, index, records, length, record;
	for(;;){
		records = container.getContentRange(starting, ending, 1024, false, null);
		length = records?.length;
		if(!length){
			return items;
		}
		for(index = 0;; ++index){
			record = records[index];
			++items;
			if(callBackFn.call(thisValue, record) == compare && undefined !== compare){
				return compare;
			}
			/* length is 1 - last element */
			if(index >= length - 2){
				if(length === 1){
					return items;
				}
				starting = records[index+1].key;
				break;
			}
			if(console){
				console.sendProgress();
				if(items % 10000 == 0){
					console.log("...iterating: %s items up to date...", items);
				}
			}
		}
	}
}


import ru.myx.ae3.vfs.Storage;
const vfs = Storage;





Object.defineProperties(vfs, {
	ROOT : {
		value : Storage.root
	},
	SORTER_KEY_ASC : {
		value : function sorterKeyAsc(a, b){
			return a.key.compareTo(b.key);
			// return a > b ? 1 : a < b ? -1 : 0;
		}
	},
	SORTER_KEY_DESC : {
		value : function sorterKeyDesc(a, b){
			return b.key.compareTo(a.key);
			// return a < b ? 1 : a > b ? -1 : 0;
		}
	},
	setContentsTree : {
		/**
		 * 
		 * @param map -
		 *            an example: { tree : { aaa : '12345', bbb : 222, ccc : { zzz : '4342' } } }
		 */
		value : function setContentsTree(container, map){
			throw new Error("Not yet!");
			var tasks = new FutureSimpleBatch(), path, target, value;
			for(path of Object.keys(map)){
				target = container.relativeFile(path);
				value = map[path];
				if(!target.isPrimitive() || target.primitiveValue !== value){
					tasks.push(target.doSetValue(value));
				}
			}
			return tasks;
		}
	},
	setContentsFromMap : {
		/**
		 * 
		 * @param container
		 * @param map - single level, files, key is pathname, value is contents
		 * @returns {Array}
		 */
		value : function setContentsFromMap(container, map){
			var tasks = new FutureSimpleBatch(), path, target, value;
			for(path of Object.keys(map)){
				target = container.relativeFile(path);
				value = map[path];
				if(!target.isPrimitive() || target.primitiveValue !== value){
					tasks.push(target.doSetValue(value));
				}
			}
			return tasks;
		}
	},
	forEach : {
		/**
		 * @param container
		 * @param callBackFn
		 * @param thisValue
		 * @returns
		 */
		value : function forEach(container, callBackFn, thisValue){
			return (internIterate(container, null, null, undefined, console, callBackFn, thisValue), undefined);
		}
	},
	some : {
		/**
		 * @param container
		 * @param callBackFn
		 * @param thisValue
		 * @returns
		 */
		value : function some(container, callBackFn, thisValue){
			return internIterate(container, null, null, true, console, callBackFn, thisValue) === true;
		}
	},
	every : {
		/**
		 * @param container
		 * @param callBackFn
		 * @param thisValue
		 * @returns
		 */
		value : function every(container, callBackFn, thisValue){
			return internIterate(container, null, null, false, console, callBackFn, thisValue) !== false;
		}
	}
});





import ru.myx.ae3.vfs.Entry;
// Entry = Entry.PROTOTYPE;

Object.defineProperties(Entry, {
	/**<code>
	relative : {
		value : function(p){
			return Storage.getRelative(this, p, null);
		}
	},
	relativeFolder : {
		value : function(p){
			return Storage.getRelativeTreeFolder(this, p);
		}
	},
	relativeFile : {
		value : function(p){
			return Storage.getRelativeTreeFile(this, p);
		}
	},
	relativePrimitive : {
		value : function(p){
			return Storage.getRelativeTreeFile(this, p).primitiveValue;
		}
	},
	relativeText : {
		value : function(p){
			return Storage.getRelativeTreeFile(this, p).textContent;
		}
	},
	relativeBinary : {
		value : function(p){
			return Storage.getRelativeTreeFile(this, p).binaryContent;
		}
	},
	updateRelativeDate : {
		value : function(p, d){
			p = Storage.getRelativeTreeFile(this, p);
			p.primitiveValue === d || (p.doSetDate(d));
			return d;
		}
	},
	updateRelativePrimitive : {
		value : function(p, v){
			p = Storage.getRelativeTreeFile(this, p);
			p.primitiveValue === v || (p.doSetPrimitive(v));
			return v;
		}
	},
	updateRelativeText : {
		value : function(p, t){
			p = Storage.getRelativeTreeFile(this, p);
			p.toCharacter().text == t || (p.doSetText(t));
			return t;
		}
	},
	*/
	
	
	
	text2 : {
		get : function(){
			return this.textContent;
			return this.toCharacter().textContent;
		}
	},
	binary2 : {
		get : function(){
			return this.binaryContent;
			return this.toBinary().binaryContent;
		}
	},
});


import ru.myx.ae3.vfs.EntryAbstract;

Object.defineProperties(EntryAbstract, {
	/** <code>
	setContentPublicTreeDate : {
		value : EntryAbstract.setContentPublicTreePrimitive
	},
	setContentPublicTreeString : {
		value : EntryAbstract.setContentPublicTreePrimitive
	},
	setContentPublicTreeNumber : {
		value : EntryAbstract.setContentPublicTreePrimitive
	},
	setContentPublicTreeBoolean : {
		value : EntryAbstract.setContentPublicTreePrimitive
	},
	 */
});



module.exports = vfs;