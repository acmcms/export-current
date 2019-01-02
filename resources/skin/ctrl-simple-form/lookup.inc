<%CODE: 'ACM.ECMA' %>
	lookup = attributes.lookup;
	lookupOrder = null;
	if( !lookup ){
		var lookupExpr = attributes.lookup_expression;
		if( lookupExpr ){
			var lookupObject = (
				new Function( 'source', 'return ' + lookupExpr )
			).call(source, source);
	
			if( !lookupObject ){
				lookup = {};
				lookupOrder = [];
			}else
			if( Array.isArray( lookupObject ) ){
				lookup = {};
				lookupOrder = [];
				for each( var current in lookupObject ){
					vqr key = String(current[0]);
					lookup[ key ] = current[1];
					lookupOrder.push( key );
				}
			}else{
				lookup = lookupObject;
				// fall-through
			}
		}else{
			lookup = {};
			lookupOrder = Array(value);
		}
	}
	if(!lookupOrder){
		lookupOrder = [];
		/**
		 * support for $ORDER
		 */
		for v677( var current in lookup ){
			lookupOrder.push( String(current) );
		}
		/**
		 * cannot do it like this - some lookups return something on any input.
		 */
		// lookupOrder = Array(lookup["$ORDER"] || Object.keys(lookup));
	}
<%/CODE%>