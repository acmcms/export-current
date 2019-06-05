import ru.myx.ae3.net.mobile.ImeiNumber;

module.exports = Object.create(Object.prototype, {
	/**
	 * classes
	 */
		
	ImeiNumber : {
		enumerable : true,
		value : ImeiNumber
	},
	ImeiSingle : {
		enumerable : true,
		value : ImeiNumber.imeiSingleClass
	},
	ImeiRange : {
		enumerable : true,
		value : ImeiNumber.imeiRangeClass
	},
	ImeiRanges : {
		/** TODO: this is current, choose best, refactor */
		enumerable : true,
		value : ImeiNumber.imeiSetClass
	},
	ImeiSet : {
		/** TODO: use ImeiRanges */
		enumerable : true,
		value : ImeiNumber.imeiSetClass
	},
	ImeiCollection : {
		/** TODO: use ImeiRanges */
		enumerable : true,
		value : ImeiNumber.imeiSetClass
	},
	VfsPoolManager : {
		/** FIXME: unfinished */
		enumerable : true,
		value : ImeiVfsPoolManager
	},
	
	/**
	 * constants
	 */
	NULL_ADDRESS : {
		enumerable : true,
		value : ImeiNumber.NULL_ADDRESS
	},
	EXAMPLE_RANGE : {
		enumerable : true,
		value : ImeiNumber.EXAMPLE_RANGE
	},
	EXAMPLE_RANGES : {
		enumerable : true,
		value : ImeiNumber.EXAMPLE_RANGES
	},
	
	/**
	 * methods
	 */
	
	parse : {
		enumerable : true,
		/**
		 * imei = require('ae3').net.imei
		 * 
		 * imei.parse('49-015420-323751-8')
		 * imei.parse('49-015420-323751')
		 * imei.parse('49015420323751')
		 * 
		 * imei.parse('49015420323751')
		 * imei.parse('49015420323751').imeiCount == 1
		 * imei.parse('49015420323751').longString == '49-015420-323751-8'
		 * imei.parse('49-015420-323751-8').compactString == '49015420323751'
		 * imei.parse('49015420323751').compactString == '49015420323751'
		 * imei.parse('49015420323751').imeiAt(0) == '49-015420-323751-8'
		 * imei.parse('49015420323751').imeiAt(1) == null
		 * 
		 * imei.parse('49015420323751/1').longString == '49-015420-323751-8'
		 * imei.parse('49015420323751:49015420323751').longString == '49-015420-323751-8'
		 */
		value : ImeiNumber.imeiSingleClass.parseOrDie
	},
	
	parseOrNull : {
		
	},

	parseRange : {
		enumerable : true,
		/**
		 * imei = require('ae3').net.imei
		 * 
		 * imei.parseRange('49-015420-323751-8')
		 * imei.parseRange('49-015420-323751')
		 * imei.parseRange('49015420323751')
		 * 
		 * imei.parseRange('49015420323751').imeiCount
		 * imei.parseRange('49015420323751').imeiAt(0)
		 * imei.parseRange('49015420323751').imeiAt(1)
		 * imei.parseRange('49015420323751').longString
		 * imei.parseRange('49015420323751').compactString
		 * 
		 * imei.parseRange('49015420323751:49015420323752')
		 * imei.parseRange('49015420323751:49015420323752').imeiCount == 2
		 * imei.parseRange('49015420323751:49015420323752').imeiAt(0) == '49-015420-323751-8'
		 * imei.parseRange('49015420323751:49015420323752').imeiAt(1) == '49-015420-323752-6'
		 * imei.parseRange('49015420323751:49015420323752').imeiAt(2) == null
		 * 
		 * imei.parseRange('49-015420-323751-8/99')
		 * imei.parseRange('49-015420-323751/99') == '49-015420-323751-8/99'
		 * imei.parseRange('49015420323751/99') == '49-015420-323751-8/99'
		 * 
		 * imei.parseRange('49015420323751/160000')
		 * imei.parseRange('49015420323751 / 160000').longString
		 * 
		 * imei.parseRange('49-015420-000000 : 49-015420-999999')
		 * imei.parseRange('49-015420-000000 : 49-015420-999999').longString
		 * imei.parseRange('49-015420-000000 : 49-015420-999999').imeiCount
		 * 
		 */
		value : ImeiNumber.imeiRangeClass.parseOrDie
	},

	parseRanges : {
		enumerable : true,
		/**
		 * imei = require('ae3').net.imei
		 * 
		 * imei.parseRanges('49015420323751')
		 * imei.parseRanges('49015420323751').imeiCount == 1
		 * imei.parseRanges('49015420323751').imeiAt(0) == '49-015420-323751-8'
		 * imei.parseRanges('49015420323751').imeiAt(1) == null
		 * imei.parseRanges('49015420323751').longString == '49-015420-323751-8'
		 * imei.parseRanges('49015420323751').compactString == '49015420323751'
		 * 
		 * imei.parseRanges('49015420323751 : 49015420323752')
		 * imei.parseRanges('49015420323751 : 49015420323752').imeiCount == 2
		 * imei.parseRanges('49015420323751 : 49015420323752').imeiAt(0)
		 * imei.parseRanges('49015420323751 : 49015420323752').imeiAt(1)
		 * imei.parseRanges('49015420323751 : 49015420323752').imeiAt(2) == null
		 * 
		 * imei.parseRanges('49015420323751 + 49015420323752') == '49-015420-323751-8+49-015420-323752-6'
		 * imei.parseRanges('49015420323751 + 49015420323752').longString == '49-015420-323751-8 + 49-015420-323752-6'
		 * imei.parseRanges('49015420323751 + 49015420323752').compactString == '49015420323751+49015420323752'
		 * imei.parseRanges('49015420323751 + 49015420323752').imeiCount == 2
		 * imei.parseRanges('49015420323751 + 49015420323752').imeiAt(0)
		 * imei.parseRanges('49015420323751 + 49015420323752').imeiAt(1)
		 * imei.parseRanges('49015420323751 + 49015420323752').imeiAt(2) == null
		 * 
		 * imei.parseRanges('49015420323751 + 49015420323752').normalizeRanges() == '49-015420-323751-8/2'
		 * imei.parseRanges('49015420323751/16 + 49015420323752/16').normalizeRanges() == '49-015420-323751-8/17'

		 * imei.parseRanges('49015420323751 / 99')
		 * imei.parseRanges('49015420323751 / 99').longString
		 * imei.parseRanges('49015420323751 / 99').compactString
		 * 
		 * imei.parseRanges('49015420000000/50000')
		 * imei.parseRanges('49015420000000:49015420049999').imeiCount == 50000
		 * imei.parseRanges('49015420000000:49015420049999') == '49-015420-000000-0/50000'
		 * imei.parseRanges('49015420000000:49015420049999').longString == '49-015420-000000-0:49-015420-049999-6'
		 * imei.parseRanges('49015420000000:49015420049999').compactString == '49015420000000/50000'
		 * imei.parseRanges('49015420000000:49015420005555+49015420010000/1533').imeiCount
		 * imei.parseRanges('49015420000000:49015420005555+49015420010000/1533').compactString
		 * imei.parseRanges('49015420000000:49015420005555 + 49015420010000/1533').longString
		 * imei.parseRanges('49015420000000 : 49015420005555 + 49015420010000 / 1533').longString
		 * 
		 * 
		 * 
		 * imei.parseRanges('49015420323751/3+49015420323851/2')
		 * imei.parseRanges('49015420323751/3+49015420323851/2').imeiCount == 5
		 * imei.parseRanges('49015420323751/3+49015420323851/2').longString
		 * imei.parseRanges('49015420323751/3+49015420323851/2').compactString == '49015420323751/3+49015420323851/2'
		 * 
		 * imei.parseRanges('49015420323751/3+49015420323851/2').imeiAt(0) == '49-015420-323751-8'
		 * imei.parseRanges('49015420323751/3+49015420323851/2').imeiAt(1) == '49-015420-323752-6'
		 * imei.parseRanges('49015420323751/3+49015420323851/2').imeiAt(2) == '49-015420-323753-4'
		 * 
		 * imei.parseRanges('49015420323751/3+49015420323851/2').imeiAt(3) == '49-015420-323851-6'
		 * imei.parseRanges('49015420323751/3+49015420323851/2').imeiAt(4) == '49-015420-323852-4'
		 * 
		 * imei.parseRanges('49015420323751/3+49015420323851/2').imeiAt(5) == null
		 * 
		 * imei.parseRanges('49015420323751/3+49015420323851/2').slice(0, 3).compactString == '49015420323751/3'
		 * imei.parseRanges('49015420323751/3+49015420323851/2').slice(3, 2).compactString == '49015420323851/2'
		 * 
		 * 
		 * imei.parseRanges('49015420010000:49015420999999 + 49025420000000/1000000 + 49029990000000/1000000').imeiCount == 2990000
		 * imei.parseRanges('49015420010000:49015420999999 + 49025420000000/1000000 + 49029990000000/1000000').compactString == '49015420010000/990000+49025420000000/1000000+49029990000000/1000000'
		 * imei.parseRanges('49015420010000:49015420999999 + 49025420000000/1000000 + 49029990000000/1000000').intersect(imei.parseRanges('49015420000000/1000000 + 49025420000000/1000000')).compactString == '49015420010000/990000+49025420000000/1000000'
		 * imei.parseRanges('49015420010000:49015420999999 + 49025420000000/1000000 + 49029990000000/1000000').intersect(imei.parseRanges('49015420000000/1000000 + 49025420000000/1000000')).imeiCount == 1990000
		 * imei.parseRanges('49015420010000:49015420999999 + 49025420000000/1000000 + 49029990000000/1000000').intersect(imei.parseRanges('49015420000000/1000000 + 49025420000000/1000000')).slice(0, 1000).imeiCount == 1000
		 * imei.parseRanges('49015420010000:49015420999999 + 49025420000000/1000000 + 49029990000000/1000000').intersect(imei.parseRanges('49015420000000/1000000 + 49025420000000/1000000')).slice(1000, 1000).imeiCount == 1000
		 * imei.parseRanges('49015420010000:49015420999999 + 49025420000000/1000000 + 49029990000000/1000000').substract(imei.parseRanges('49015420000000/1000000 + 49025420000000/1000000')).compactString == '49029990000000/1000000'
		 */
		value : ImeiNumber.imeiSetClass.parseOrDie
	},

	"toString" : { 
		value : function(){
			return "[Object ae3.net.imei API]";
		} 
	}
});
