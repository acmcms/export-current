/**
 * RT3 dbi.
 * 
 * 
 */


/**
 * it is map and list both
 */
import ru.myx.util.BaseMapSqlResultSet;

/**
 * used to get current server
 */
import ru.myx.ae3.act.Context;

/**
 * public API
 */



/**
 * 
 * require('ru.acmcms/dbi').executeCallback('default', function(conn){
 * 		// my code here
 * 		return 'aaa';
 * }, this) == 'aaa';
 * 
 */
/**
 * @param poolNameOrConnection
 * @param callbackFn
 * @param thisObject
 * @return result of callbackFn execution
 */
var executeCallback = exports.executeCallback = function executeCallback(poolNameOrConnection, callbackFn, thisObject) {
	switch (typeof poolNameOrConnection) {
	case 'undefined':
	case 'null':
	case 'number':
	case 'function':
		throw new TypeError("Invalid argument type");
	case 'string': {
		var server = Context.getServer(), 
			conn = server.getServerConnection(poolNameOrConnection);
		if(!conn){
			throw "Connection pool is undefined: name=" + poolNameOrConnection;
		}
		try {
			return callbackFn.call(thisObject || null, conn);
		} finally {
			conn?.close();
		}
	}
	default: {
		var conn = poolNameOrConnection;
		if(conn === null){
			/**
			 * we have 'object' as result of typeof operator on null value.
			 */
			throw new TypeError("Invalid argument type: null value");
		}
		/**
		 * We'll just hope it is connection indeed. We'll check just a presence
		 * of something in order to rule out most of the unintended errors.
		 */
		if(conn.close && conn.createStatement && 'function' == typeof conn.prepareStatement){
			return callbackFn.call(thisObject || null, conn);
		}
		throw new TypeError("Invalid argument type");
	}
	}
};

/**
 * 
 * require('ru.acmcms/dbi').executeTransaction('default', function(conn){
 * 		// my code here
 * 		return 'aaa';
 * }, this) == 'aaa';
 *
 */
/**
 * 
 * Will start transaction. Transaction is to be committed on success or rolled
 * back on exception after an attempt to execute callbackFn.
 * 
 * You need this (as opposed to 'executeCallback') when you are going to make
 * changes (updates, deleted, inserts...)
 * 
 * @param poolNameOrConnection
 * @param callbackFn
 * @param thisObject
 * @return result of callbackFn execution
 */
var executeTransaction = exports.executeTransaction = function executeTransaction(poolNameOrConnection, callbackFn, thisObject) {
	return executeCallback(poolNameOrConnection, function executeTransactionFn(conn){
		conn.setAutoCommit(false);
		try {
			var result = callbackFn.call(thisObject || null, conn);
			conn.commit();
			return result;
		} catch (e) {
			conn.rollback();
			throw e;
		}
	}, thisObject);
};

/**
 * 
 * require('ru.acmcms/dbi').executeSelectEvery('default', 
 * 		"SELECT id, name, email, birthday "+
 * 		"FROM employees "+
 * 		"WHERE departmentId = 5 "+
 * 		"ORDER BY birthday ASC", 
 * 	function(id, name, email, birthday){
 * 		= '<div>'+ 
 * 			'<a href=' + Format.xmlAttributeValue( "employee?id=" + id ) + '>' + 
 * 				Format.xmlNodeValue( name ) + 
 * 			'</a>'+
 * 			' (<a href=' + Format.xmlAttributeValue( "mailto:" + email ) + '>' +
 * 				Format.xmlNodeValue( email ) +
 * 			'</a>)'+
 * 		'</div>';
 * } );
 * 
 * 
 * require('ru.acmcms/dbi').executeSelectEvery('default', 
 * 		"SELECT id, name, email, birthday "+
 * 		"FROM employees "+
 * 		"WHERE departmentId = 5 "+
 * 		"ORDER BY birthday ASC", 
 * 	function(employee){
 * 		= '<div>'+ 
 * 			'<a href=' + Format.xmlAttributeValue( "employee?id=" + employee.id ) + '>' + 
 * 				Format.xmlNodeValue( employee.name ) + 
 * 			'</a>'+
 * 			' (<a href=' + Format.xmlAttributeValue( "mailto:" + employee.email ) + '>' +
 * 				Format.xmlNodeValue( employee.email ) +
 * 			'</a>)'+
 * 		'</div>';
 * } );
 * 
 *
 */
var executeSelectEvery = exports.executeSelectEvery = function executeSelectEvery(poolNameOrConnectionName, query, callbackFn, thisObject){
	return executeCallback(poolNameOrConnectionName, function executeSelectEveryFn(conn){
		var st = conn.createStatement();
		throw 'sorry, have not decided yet, please ping me at myx@myx.co.nz with complete error';
	}, thisObject);
};

/**
 * 
 * var employee = require('ru.acmcms/dbi').executeSelectOne('default', 
 * 		"SELECT id, name, email, birthday FROM employees WHERE id = 5" );
 * 
 * alert( employee 
 * 		? Format.jsObject( employee )
 * 		: "Not found!" );
 * 
 */
var executeSelectOne = exports.executeSelectOne = function executeSelectOne(poolNameOrConnectionName, query){
	return executeCallback(poolNameOrConnectionName, function executeSelectOneFn(conn){
		var st = conn.createStatement();
		try {
			var rs = st.executeQuery( query );
			try {
				if(!rs.next()){
					return null;
				}
				var row = [], map = new BaseMapSqlResultSet(rs), keys = Array(map.keySet()), i;
				for( i = 0; i < map.length; ++i ){
					// assert map[i] == map[keys[i]]
					// which means a particular order for keySet()
					row[i] = row[keys[i]] = map[i];
				}
				return row;
			} finally {
				try {
					rs.close();
				} catch (final Throwable t) {
					// ignore
				}
			}
		} finally {
			try {
				st.close();
			} catch (final Throwable t) {
				// ignore
			}
		}
	}, thisObject);
};

/**
 * 
 * var employees = require('ru.acmcms/dbi').executeSelectAll('default', 
 * 		"SELECT id, name, email, birthday "+
 * 		"FROM employees "+
 * 		"WHERE departmentId = 5 "+
 * 		"ORDER BY birthday ASC" );
 * 
 * employees.forEach(function(employee){
 * 	= '<div>'+ 
 * 		'<a href=' + Format.xmlAttributeValue( "employee?id=" + employee.id ) + '>' + 
 * 			Format.xmlNodeValue( employee.name ) + 
 * 		'</a>'+
 * 		' (<a href=' + Format.xmlAttributeValue( "mailto:" + employee.email ) + '>' +
 * 			Format.xmlNodeValue( employee.email ) +
 * 		'</a>)'+
 * 	'</div>';
 * });
 * 
 */
var executeSelectAll = exports.executeSelectAll = function executeSelectAll(poolNameOrConnectionName, query){
	return executeCallback(poolNameOrConnectionName, function executeSelectAllFn(conn){
		var st = conn.createStatement();
		try {
			/**
			 * > Method org.postgresql.jdbc4.Jdbc4Statement.setQueryTimeout(int) is not yet implemented.
			 */
			// st.setQueryTimeout(120);
			var rs = st.executeQuery( query );
			try {
				if(!rs.next()){
					return null;
				}
				var result = [], row, map = new BaseMapSqlResultSet(rs), keys = Array(map.keySet()), l = map.length, i;
				for(;;){
					row = [];
					for( i = 0; i < l; ++i ){
						// assert map[i] == map[keys[i]]
						// which means a particular order for keySet()
						row[i] = row[keys[i]] = map[i];
					}
					result.push(row);
					if(!rs.next()){
						return result;
					}
				}
			} finally {
				try {
					rs.close();
				} catch (final Throwable t) {
					// ignore
				}
			}
		} finally {
			try {
				st.close();
			} catch (final Throwable t) {
				// ignore
			}
		}
	}, thisObject);
};

/**
 * 
 * var count = require('ru.acmcms/dbi').executeUpdate('default', 
 * 		"UPDATE exampleTable SET exampleX = 5 WHERE exampleX IS NULL" );
 * 
 * count > 0 && alert( count + ' row(s) updated' );
 * 
 */
/**
 * Don't be confused by name - it is not only for UPDATE statements, but for
 * DELETE, as well as any other single-row-single-column-integer-result query.
 * 8-) WOW!
 * 
 * @param poolNameOrConnection
 * @param query
 * @return boolean
 */
var executeUpdate = exports.executeUpdate = function executeUpdate(poolNameOrConnectionName, query){
	return executeCallback(poolNameOrConnectionName, function executeUpdateFn(conn){
		var st = conn.createStatement();
		try {
			return st.executeUpdate( query );
		} finally {
			try {
				st.close();
			} catch (final Throwable t) {
				// ignore
			}
		}
	}, thisObject);
};
