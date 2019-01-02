import ru.myx.ae3.net.MacAddress;
import ru.myx.ae3.net.MacVfsPoolManager;

module.exports = Object.create(Object.prototype, {
	/**
	 * classes
	 */
		
	MacAddress : {
		enumerable : true,
		value : MacAddress
	},
	MacSingle : {
		enumerable : true,
		value : MacAddress.singleClass
	},
	MacRange : {
		enumerable : true,
		value : MacAddress.rangeClass
	},
	MacRanges : {
		enumerable : true,
		value : MacAddress.poolClass
	},
	MacPool : {
		enumerable : true,
		value : MacAddress.poolClass
	},
	VfsPoolManager : {
		enumerable : true,
		value : MacVfsPoolManager
	},
	
	/**
	 * constants
	 */
	NULL_ADDRESS : {
		enumerable : true,
		value : MacAddress.NULL_ADDRESS
	},
	EXAMPLE_RANGE : {
		enumerable : true,
		value : MacAddress.EXAMPLE_RANGE
	},
	EXAMPLE_RANGES : {
		enumerable : true,
		value : MacAddress.EXAMPLE_RANGES
	},
	
	/**
	 * methods
	 */
	
	parse : {
		enumerable : true,
		/**
		 * mac = require('ae3').net.mac
		 * 
		 * mac.parse('00:12:AA:12:45:01')
		 * 
		 * mac.parse('0012AA124501')
		 * 
		 * mac.parse('00:12:AA:12:45:01')
		 * mac.parse('00:12:AA:12:45:01').macCount
		 * mac.parse('00:12:AA:12:45:01').longString
		 * mac.parse('00:12:AA:12:45:01').macAt(0)
		 * mac.parse('00:12:AA:12:45:01').macAt(1)
		 * 
		 * mac.parse('00:12:AA:12:45:01/1').longString
		 * mac.parse('00:12:AA:12:45:01-00:12:AA:12:45:01').longString
		 */
		value : MacAddress.singleClass.parseOrDie
	},

	parseRange : {
		enumerable : true,
		/**
		 * mac = require('ae3').net.mac
		 * 
		 * mac.parseRange('00:12:AA:12:45:01')
		 * mac.parseRange('00:12:AA:12:45:01').macCount
		 * mac.parseRange('00:12:AA:12:45:01').macAt(0)
		 * mac.parseRange('00:12:AA:12:45:01').macAt(1)
		 * mac.parseRange('00:12:AA:12:45:01').longString
		 * mac.parseRange('00:12:AA:12:45:01').compactString
		 * 
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02')
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macCount
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(0)
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(1)
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(2)
		 * 
		 * mac.parseRange('0012AA124501')
		 * mac.parseRange('0012AA124501/99')
		 * 
		 * // https://code.wireshark.org/review/gitweb?p=wireshark.git;a=blob_plain;f=manuf
		 * mac.parseRange('10:7B:EF:00:00:00/16000000')
		 * mac.parseRange('10:7D:1A:00:00:00 / 16777216').longString
		 * 
		 * mac.parseRange('10:7B:EF:00:00:00 - 10:7B:EF:FF:FF:FF')
		 * mac.parseRange('10:7B:EF:00:00:00 - 10:7B:EF:FF:FF:FF').longString
		 * mac.parseRange('10:7B:EF:00:00:00 - 10:7B:EF:FF:FF:FF').macCount
		 * 
		 */
		value : MacAddress.rangeClass.parseOrDie
	},

	parseRanges : {
		enumerable : true,
		value : MacAddress.poolClass.parseOrDie
	},

	parsePool : {
		enumerable : true,
		/**
		 * mac = require('ae3').net.mac
		 * 
		 * mac.parsePool('00:12:AA:12:45:01')
		 * mac.parsePool('00:12:AA:12:45:01').macCount
		 * mac.parsePool('00:12:AA:12:45:01').macAt(0)
		 * mac.parsePool('00:12:AA:12:45:01').macAt(1)
		 * mac.parsePool('00:12:AA:12:45:01').longString
		 * mac.parsePool('00:12:AA:12:45:01').compactString
		 * 
		 * mac.parsePool('00:12:AA:12:45:01 - 00:12:AA:12:45:02')
		 * mac.parsePool('00:12:AA:12:45:01 - 00:12:AA:12:45:02').macCount
		 * mac.parsePool('00:12:AA:12:45:01 - 00:12:AA:12:45:02').macAt(0)
		 * mac.parsePool('00:12:AA:12:45:01 - 00:12:AA:12:45:02').macAt(1)
		 * mac.parsePool('00:12:AA:12:45:01 - 00:12:AA:12:45:02').macAt(2)
		 * 
		 * mac.parsePool('00:12:AA:12:45:01 + 00:12:AA:12:45:02')
		 * mac.parsePool('00:12:AA:12:45:01 + 00:12:AA:12:45:02').macCount
		 * mac.parsePool('00:12:AA:12:45:01 + 00:12:AA:12:45:02').macAt(0)
		 * mac.parsePool('00:12:AA:12:45:01 + 00:12:AA:12:45:02').macAt(1)
		 * mac.parsePool('00:12:AA:12:45:01 + 00:12:AA:12:45:02').macAt(2)
		 * 
		 * mac.parsePool('0012AA124501')
		 * mac.parsePool('0012AA124501 / 99')
		 * 
		 * // https://code.wireshark.org/review/gitweb?p=wireshark.git;a=blob_plain;f=manuf
		 * mac.parsePool('10:7B:EF:00:00:00/16000000')
		 * mac.parsePool('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF')
		 * mac.parsePool('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF+10:7D:1A:00:00:00/16777216').macCount
		 * mac.parsePool('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF+10:7D:1A:00:00:00/16777216').compactString
		 * mac.parsePool('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF + 10:7D:1A:00:00:00/16777216').longString
		 * mac.parsePool('10:7B:EF:00:00:00 - 10:7B:EF:FF:FF:FF + 10:7D:1A:00:00:00 / 16777216').longString
		 * 
		 * mac.parsePool('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF').macCount
		 * 
		 * 
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2')
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macCount
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').longString
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').compactString
		 * 
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(0)
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(1)
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(2)
		 * 
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(3)
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(4)
		 * 
		 * mac.parsePool('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(5)
		 */
		value : MacAddress.poolClass.parseOrDie
	},

	"toString" : { 
		value : function(){
			return "[Object ae3.net.mac API]";
		} 
	}
});
