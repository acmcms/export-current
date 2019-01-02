
import ru.myx.ae3.concurrent.CommonHelper;

import ru.myx.ae3.common.FutureSimpleBatch;
import ru.myx.ae3.common.FutureCallParallel;

// import ru.myx.ae3.common.FutureCustomUnknown;

import ru.myx.ae3.concurrent.FunctionWrapOnce;
import ru.myx.ae3.concurrent.FunctionWrapSync;
import ru.myx.ae3.concurrent.FunctionWrapSyncThis;
import ru.myx.ae3.concurrent.FunctionWrapBuffered;
import ru.myx.ae3.concurrent.FunctionWrapDeferred;



const ConcurrentAPI = module.exports = Object.create(Object.prototype, {
	/***************************************************************************
	 * classes
	 */
	HashMap : {
		value : require('java.class/java.util.concurrent.ConcurrentHashMap'),
		enumerable : true
	},
	
	CoarseDelayCache : {
		value : require('java.class/ru.myx.ae3.concurrent.CoarseDelayCache'),
		enumerable : true
	},
	
	SupplierCachedLazy : {
		value : require('java.class/ru.myx.ae3.util.concurrent.BaseSupplierCachedLazy'),
		enumerable : true
	},
	SupplierOnceLazy : {
		value : require('java.class/ru.myx.ae3.util.concurrent.BaseSupplierOnceLazy'),
		enumerable : true
	},

	FutureSimpleUnknown : {
		value : require('java.class/ru.myx.ae3.common.FutureSimpleUnknown'),
		enumerable : true
	},
	FutureSimpleString : {
		value : require('java.class/ru.myx.ae3.common.FutureSimpleCharSequence'),
		enumerable : true
	},
	FutureSimpleBinary : {
		value : require('java.class/ru.myx.ae3.common.FutureSimpleTransferCopier'),
		enumerable : true
	},
	SimpleFutureBatchClass : {
		value : FutureSimpleBatch,
		enumerable : true
	},
	FutureCallParallelClass : {
		value : FutureCallParallel,
		enumerable : true
	},
	/**
	 * new CustomFutureObjectClass( future, callback );
	 * 
	 * example:
	 * 
	 * function loadLicenseImpl(x){ }
	 * 
	 * function loadLicense(){ return new
	 * CustomFutureObjectClass(vfs.getContentsCollection(null),
	 * loadLicenseImpl); }
	 */
	CustomFutureObjectClass : {
		value : FutureCustomObject,
		enumerable : true
	},
	FutureFirstPositiveClass : {
		value : FutureFirstPositiveObject,
		enumerable : true
	},
	
	FunctionWrapOnceClass : {
		value : FunctionWrapOnce,
		enumerable : true
	},
	FunctionWrapSyncClass : {
		value : FunctionWrapSync,
		enumerable : true
	},
	
	/***************************************************************************
	 * Objects
	 */

	AbstractTask : {
		get : function(){
			return require('ae3.concurrent/AbstractTask');
		},
		enumerable : true
	},
	
	/***************************************************************************
	 * Methods
	 */

	firstPositive : {
		value : function firstPositive(arr){
			var t, r;
			for(t of arr){
				r = t();
				if(r){
					return r;
				}
			}
			return undefined;
		},
		enumerable : true
	},
	
	mapAll : {
		value : function mapAll(arr){
			var t, r = [];
			for(t of arr){
				r.push(t());
			}
			return r;
		},
		enumerable : true
	},
	
	asyncAll : {
		value : function asyncAll(/* variable arguments */){
			return new FutureCallParallel(arguments);
		},
		enumerable : true
	},
	
	isPending : {
		value : CommonHelper.isTaskPending,
		enumerable : true
	},
	isFailed : {
		value : CommonHelper.isTaskFailed,
		enumerable : true
	},
	
	awaitCompletion : {
		value : CommonHelper.awaitTaskCompletion,
		enumerable : true
	},
	awaitResult : {
		value : CommonHelper.awaitTaskResult,
		enumerable : true
	},
	
	/**
	 * makes a function that runs not more than once and then returns the same
	 * result all the time.
	 */
	wrapOnce : {
		value : CommonHelper.wrapOnce,
		enumerable : true
	},
	
	/**
	 * makes a function that runs not more than once and then returns the same
	 * result all the time. after expiration time passed it will run again if called.
	 */
	wrapOnceWithExpiration : {
		value : CommonHelper.wrapOnceWithExpiration,
		enumerable : true
	},
	/**
	 * makes a function that runs only in serial with any other invocations that
	 * are locked on the same lock object.
	 */
	wrapSync : { 
		value : CommonHelper.wrapSync,
		enumerable : true
	},
	/**
	 * makes a function that spreads the load between the 'f' functions based on
	 * the hash code value of the first argument (the first argument becomes
	 * mandatory).
	 * 
	 * 'f' must be an array of functions, for optimal results, use the power of
	 * two numbers, like: 2, 4, 8...
	 */
	wrapHash : {
		value : function(f){
			return new FunctionWrapHash(f);
		},
		enumerable : true
	},
	/**
	 * makes a function that spreads the load between the 'f' functions based on
	 * the number of the invocation spreading the load evenly.
	 * 
	 * 'f' must be an array of functions, for optimal results, use the power of
	 * two numbers, like: 2, 4, 8...
	 */
	wrapLoop : {
		value: function(f){
			return new FunctionWrapLoop(f);
		},
		enumerable : true
	},
	/**
	 * makes a buffered function.
	 * 
	 * the 'f' function is special: it receives a queue object and reads
	 * invocation arguments from it, it exits when the queue is empty or the
	 * loop limit is reached.
	 * 
	 * f(queue)
	 * 
	 * 'queue' is a fifo queue (array) of arguments objects
	 * 
	 * options : { // if specified, the conversion will be applied to arguments
	 * before buffering arguments : { } promises : false, bufferCapacity : 256,
	 * delay : 0, period : 0, }
	 */
	wrapBuffered : {
		value : function(f, options){
			return new FunctionWrapBuffered(f, options || f);
		},
		enumerable : true
	},
	/**
	 * makes a deferred function.
	 * 
	 * options : { promises : false, bufferCapacity : 256, maxWorkers : 8 }
	 */
	wrapDeferred : {
		value : CommonHelper.wrapDeferred,
		enumerable : true
	},
	/**
	 * makes a deferred async (runs in parallel concurrently with all other
	 * active tasks and threads, returns no result immediately)
	 */
	wrapDeferredAsync : {
		value : CommonHelper.wrapDeferredAsync,
		enumerable : true
	},
});

