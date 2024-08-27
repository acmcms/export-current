/**
 * this is not a CommonJS module!
 */
/**
 * global.js
 * 
 * this script is executed in GLOBAL context, implicitThisValue and thisValue
 * are both associated with GLOBAL object.
 * 
 * EXAMPLE CODE:<code>
	this.VlapanAPI = {
		VlapanAPI : function VlapanAPI(){
			this.zzz = 35;
			this.xxx = this.method1(arg1);
			return this;
		},
		field1 : 55,
		field2 : {
			a : 'a',
			b : 'b'
		},
		method1 : function(arg1){
			return 'aa';
		}
	};
 </code>
 */



/**
 * CommonJS support. Libraries could be stored in:
 * 1) %SERVER%/lib
 * 2) %PROTECTED%/resources/lib/
 * 3) %PUBLIC%/resources/lib/
 * 
 * TODO: add support for %SKIN%/lib as well.
 */

import java.lang.Class;
import java.nio.file.Paths;
import ru.myx.ae3.vfs.Storage;

const cacheVfs = Class.forName('ru.myx.ae3.util.base.MapperBuilder')//
	.builderCachedLazy()			// same as constructor
	.setExpireMillis(-1)			// never expire an element
	.setRefreshMillis(10 * 1000)	// check changes not sooner than in 10 seconds
	.setValueSourceFixed(function(moduleName, cached){
		var	entry;
		// if(server){
		//	entry = server.requireResolveVfsModule(moduleName);
		// }else//
		if(ApplicationAPI && /*'function' === typeof */ApplicationAPI.requireResolveVfsModule){
			entry = ApplicationAPI.requireResolveVfsModule( moduleName );
		} else {
			entry = Storage.UNION_LIB.relative(moduleName + ".js", null );
			if(!entry && !moduleName.endsWith("/index")){
				entry = Storage.UNION_LIB.relative(moduleName + "/index.js", null);
			}
		}
		if(!entry){
			// cacheVfs bind to this
			// cached && (delete this[moduleName]);
			throw "require: module " + FormatAPI.jsString(moduleName) + " was not found.";
		}
		entry = entry.toBinary();
		
		const modified = entry.lastModified;
		const size = entry.binaryContentLength;
		if(cached && cached.srcModified === modified && cached.srcSize === size){
			return cached;
		}
		
		cached = { 
			id : moduleName,
			srcModified : modified,
			srcSize : size,
			exports : {},
			vfs : entry
		};
		const focusPath = moduleName.substr(0, moduleName.lastIndexOf('/') + 1);
		(new Function( "require", "exports", "module", moduleName /* for debugging */ , entry.textContent)).call( 
			module, 
			// cacheVfs bind to this
			cachePkg[focusPath] || (cachePkg[focusPath] = requireImpl.bind(this, focusPath)), 
			cached.exports, 
			cached 
		);
		return cached;
	}) //
	.build()
;


/**
 * virtual 'require's by prefix.
 */
const cachePkg = {};

/**
 * 'this' is bind to cache
 * 
 * @param focusPath
 * @param moduleName
 * @returns
 */
function requireImpl( focusPath, moduleName ){
	// if(Array.isArray(moduleName)){
	//	return //
	// }
	if(moduleName[0] === '.'){
		if(moduleName[1] === '/' /* moduleName.startsWith("./") */){
			// relative require
			// cacheVfs bind to this
			return this(focusPath + moduleName.substr(2)).exports;
		}
		if(moduleName[1] === '.' && moduleName[2] === '/' /* moduleName.startsWith("../") */){
			// relative require
			// cacheVfs bind to this
			return this(Paths.get(focusPath, moduleName).normalize().toString()).exports;
		}
	}else//
	if(moduleName[0] === 'j' && moduleName[10] === '/' && moduleName.startsWith("java.class/")){
		// java class import feature
		return Class.forName(moduleName.substring(11));
	}
	
	// cacheVfs bind to this
	return this(moduleName).exports;
}

Object.defineProperty(this, "require", {
	/* cacheVfs bind to this */
	value : requireImpl.bind(cacheVfs, "")
});

