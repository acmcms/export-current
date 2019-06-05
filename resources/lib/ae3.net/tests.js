// calc require('ae3.net/tests')()

module.exports = function(){
	const L = function(x){
		console.log("ae3/net.tests: ", x);
	};
	
	L('init...');

	const net = require('ae3/net');
	// L('net module loaded, net: ' + net + ", detail: " + Format.jsDescribe(net));
	
	
	const dns = net.dns;
	const mac = net.mac;
	const ssl = net.ssl;
	const tcp = net.tcp;
	const udp = net.udp;
	
	L('net module subsystems loaded.');
	
	const A = function(o, s){
		const O = String(o);
		const S = String(s);
		if(O !== S){
			const e = "Doesn't match: " + Format.jsObject(O) + " != " + Format.jsObject(S);
			console.error(e);
			throw new Error(e);
		}
	};

	/**
	 * MAC
	 */
	{
		L('MAC...');
		
		{
			L('MAC parse single...');

			A(mac.parse('0012AA124501'), 
			'00:12:aa:12:45:01');
	
			A(mac.parse('0012aa124501'), 
			'00:12:aa:12:45:01');
			
			A(mac.parse('00:12:aa:12:45:01'), 
			'00:12:aa:12:45:01');
			
			A(mac.parse('00:12:AA:12:45:01'), 
			'00:12:aa:12:45:01');
	
			A(mac.parse('00:12:aa:12:45:01').macCount, 
			'1');
	
			A(mac.parse('00:12:AA:12:45:01').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parse('00:12:AA:12:45:01-00:12:AA:12:45:01').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parse('00:12:AA:12:45:01/1').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parse('00:12:AA:12:45:01').compactString, 
			'0012aa124501');
			
			A(mac.parse('00:12:AA:12:45:01').macAt(0), 
			'00:12:aa:12:45:01');
			
			A(mac.parse('00:12:AA:12:45:01').macAt(0).compactString, 
			'0012aa124501');
			
			A(mac.parse('00:12:AA:12:45:01').macAt(1), 
			'null');
			
			L('MAC parse single done.');
		}
		{
			L('MAC single union...');

			A(mac.parse('00:12:AA:12:45:01').union(mac.parse('00:13:AA:12:45:01')).longString, 
			'00:12:aa:12:45:01 + 00:13:aa:12:45:01');
			
			A(mac.parse('00:12:AA:12:45:01').union(mac.parse('00:12:AA:12:45:01')).longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parse('00:12:AA:12:45:01').union(mac.parse('00:12:AA:12:45:02')).longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:02');
			
			A(mac.parse('00:12:AA:12:45:02').union(mac.parse('00:12:AA:12:45:01')).longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:02');
			
			A(mac.parse('00:12:AA:12:45:01').union(mac.parse('00:12:AA:12:45:00')).longString, 
			'00:12:aa:12:45:00-00:12:aa:12:45:01');

			L('MAC single union done.');
		}
		{
			L('MAC single substract...');
			
			A(mac.parse('00:12:AA:12:45:01').substract(mac.parse('00:13:AA:12:45:01')).longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parse('00:12:AA:12:45:01').substract(mac.parse('00:13:AA:12:45:01')).macCount, 
			'1');

			A(mac.parse('00:12:AA:12:45:01').substract(mac.parse('00:12:AA:12:45:01')).macCount, 
			'0');
			
			L('MAC single substract done.');
		}
		{
			L('MAC single intersect...');

			A(mac.parse('00:12:AA:12:45:01').intersect(mac.parse('00:13:AA:12:45:01')).macCount, 
			'0');

			A(mac.parse('00:12:AA:12:45:01').intersect(mac.parse('00:12:AA:12:45:01')).macCount, 
			'1');
			
			L('MAC single intersect done.');
		}
		{
			L('MAC parseRange single...');

			A(mac.parseRange('0012AA124501'), 
			'00:12:aa:12:45:01');
	
			A(mac.parseRange('00:12:AA:12:45:01'), 
			'00:12:aa:12:45:01');
	
			A(mac.parseRange('00:12:AA:12:45:01').macCount, 
			'1');
	
			A(mac.parseRange('00:12:AA:12:45:01').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:01').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parseRange('00:12:AA:12:45:01 - 00:12:AA:12:45:01').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parseRange('00:12:AA:12:45:01/1').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parseRange('00:12:AA:12:45:01').compactString, 
			'0012aa124501');
			
			A(mac.parseRange('00:12:AA:12:45:01').macAt(0), 
			'00:12:aa:12:45:01');
			
			A(mac.parseRange('00:12:AA:12:45:01').macAt(0).compactString, 
			'0012aa124501');
			
			A(mac.parseRange('00:12:AA:12:45:01').macAt(1), 
			'null');
			
			L('MAC parseRange single done.');
		}
		{
			L('MAC parseRange range...');

			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02'), 
			'00:12:aa:12:45:01/2');

			A(mac.parseRange('00:12:AA:12:45:01 - 00:12:AA:12:45:02'), 
			'00:12:aa:12:45:01/2');
	
			A(mac.parseRange('00:12:AA:12:45:01/2'), 
			'00:12:aa:12:45:01/2');
	
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macCount, 
			'2');
	
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:02');
			
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').compactString, 
			'0012aa124501/2');
			
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(0), 
			'00:12:aa:12:45:01');
			
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(1), 
			'00:12:aa:12:45:02');
			
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(2), 
			'null');
			

			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').isEmpty(), 
			'false');
			
			A(mac.parse('00:13:AA:12:45:01').isEmpty(), 
			'false');


			L('MAC parseRange range done.');
		}
		{
			L('MAC range union...');

			A(mac.parse('00:15:AA:12:45:01').union(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02')).longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:02 + 00:15:aa:12:45:01');

			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').union(mac.parse('00:13:AA:12:45:01')).longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:02 + 00:13:aa:12:45:01');

			
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').union(mac.parse('00:12:AA:12:45:01')).longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:02');
			
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').union(mac.parse('00:12:AA:12:45:02')).longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:02');

			// overlaps
			A(mac.parseRange('00:12:AA:12:15:01-00:12:AA:12:15:02').union(mac.parseRange('00:12:AA:12:15:02-00:12:AA:12:15:03')).longString, 
			'00:12:aa:12:15:01-00:12:aa:12:15:03');

			// connects
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').union(mac.parse('00:12:AA:12:45:03')).longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:03');
			
			// overlaps
			A(mac.parse('11:17:AA:12:45:02').union(mac.parseRange('11:17:AA:12:45:01-11:17:AA:12:45:02')).longString, 
			'11:17:aa:12:45:01-11:17:aa:12:45:02');
			
			// connects
			A(mac.parse('00:12:AA:12:42:03').union(mac.parseRange('00:12:AA:12:42:01-00:12:AA:12:42:02')).longString, 
			'00:12:aa:12:42:01-00:12:aa:12:42:03');
			
			// overlaps
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').union(mac.parse('00:12:AA:12:45:00')).longString, 
			'00:12:aa:12:45:00-00:12:aa:12:45:02');
			
			// connects
			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').union(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02')).longString, 
			'00:12:aa:12:45:01-00:12:aa:12:45:09');
			
			A(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').union(mac.parseRange('00:12:AA:12:44:00-00:12:AA:12:45:00')).longString, 
			'00:12:aa:12:44:00-00:12:aa:12:45:02');

			L('MAC range union done.');
		}
		{
			L('MAC range substract...');

			// connects
			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').substract(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02')).longString, 
			'00:12:aa:12:45:03-00:12:aa:12:45:09');
			
			// overlaps
			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').substract(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:05')).longString, 
			'00:12:aa:12:45:06-00:12:aa:12:45:09');
			
			// contains
			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').substract(mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:99')).macCount, 
			'0');
			
			// prefix
			A(mac.parseRange('00:12:aa:bb:00:00-00:12:AA:bb:10:00').substract(
			  mac.parseRange('00:12:aa:bb:00:00-00:12:aa:bb:00:1f')).longString, 
			'00:12:aa:bb:00:20-00:12:aa:bb:10:00');
			
			// prefix #2
			A(mac.parseRange('21:ab:cd:00:00:00/65536').substract(
			  mac.parseRange('21:ab:cd:00:00:00/768')).longString, 
			'21:ab:cd:00:03:00-21:ab:cd:00:ff:ff');
			
			// suffix
			A(mac.parseRange('00:12:aa:bb:00:00-00:12:AA:bb:10:00').substract(mac.parseRange('00:12:aa:bb:00:50-00:12:aa:bb:10:00')).longString, 
			'00:12:aa:bb:00:00-00:12:aa:bb:00:4f');
			
			L('MAC range substract done.');
		}
		{
			L('MAC range intersect...');

			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').intersect(mac.parse('00:13:AA:12:45:01')).macCount, 
			'0');

			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').intersect(mac.parse('00:12:AA:12:45:04')).macCount, 
			'1');

			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').intersect(mac.parse('00:12:AA:12:45:04')).longString, 
			'00:12:aa:12:45:04');

			/** includes */
			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').intersect(mac.parseRange('00:12:AA:12:45:05-00:12:AA:12:45:06')).macCount, 
			'2');

			/** includes */
			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').intersect(mac.parseRange('00:12:AA:12:45:05-00:12:AA:12:45:06')).longString, 
			'00:12:aa:12:45:05-00:12:aa:12:45:06');

			/** overlaps left */
			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').intersect(mac.parseRange('00:12:AA:12:45:00-00:12:AA:12:45:06')).longString, 
			'00:12:aa:12:45:03-00:12:aa:12:45:06');

			/** overlaps right */
			A(mac.parseRange('00:12:AA:12:45:03-00:12:AA:12:45:09').intersect(mac.parseRange('00:12:AA:12:45:05-00:12:AA:12:45:99')).longString, 
			'00:12:aa:12:45:05-00:12:aa:12:45:09');

			L('MAC range intersect done.');
		}
		{
			L('MAC parseRanges single...');

			A(mac.parseRanges('0012AA124501'), 
			'00:12:aa:12:45:01');
	
			A(mac.parseRanges('00:12:AA:12:45:01'), 
			'00:12:aa:12:45:01');
	
			A(mac.parseRanges('00:12:AA:12:45:01').macCount, 
			'1');
	
			A(mac.parseRanges('00:12:AA:12:45:01').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parseRanges('00:12:AA:12:45:01-00:12:AA:12:45:01').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parseRanges('00:12:AA:12:45:01 - 00:12:AA:12:45:01').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parseRanges('00:12:AA:12:45:01/1').longString, 
			'00:12:aa:12:45:01');
			
			A(mac.parseRanges('00:12:AA:12:45:01').compactString, 
			'0012aa124501');
			
			A(mac.parseRanges('00:12:AA:12:45:01').macAt(0), 
			'00:12:aa:12:45:01');
			
			A(mac.parseRanges('00:12:AA:12:45:01').macAt(0).compactString, 
			'0012aa124501');
			
			A(mac.parseRanges('00:12:AA:12:45:01').macAt(1), 
			'null');
			
			A(mac.parseRanges('11:ab:cd:00:00:00-11:ab:cd:ff:ff:ff').macCount,
			'16777216');
			
			A(mac.parseRanges('11:ab:cd:00:00:00-11:ab:cd:ff:ff:ff').macCount,
			'16777216');
			
			L('MAC parseRanges single done.');
		}
		{
			L('MAC pool union...');
			
			/** non intersecting */
			A(mac.parseRanges('11:ab:cd:00:00:00-11:ab:cd:00:ff:ff').union(mac.parseRanges('11:ab:cd:02:00:00-11:ab:cd:02:ff:ff')).longString,
			'11:ab:cd:00:00:00-11:ab:cd:00:ff:ff + 11:ab:cd:02:00:00-11:ab:cd:02:ff:ff');

			/** overlapping */
			A(mac.parseRanges('11:ab:cd:00:00:00-11:ab:cd:00:ff:ff').union(mac.parseRanges('11:ab:cd:00:00:ff-11:ab:cd:02:ff:ff')).longString,
			'11:ab:cd:00:00:00-11:ab:cd:02:ff:ff');
			
			/** connected right */
			A(mac.parseRanges('13:ab:cd:00:00:00-13:ab:cd:00:ff:ff').union(mac.parseRanges('13:ab:cd:01:00:00-13:ab:cd:02:ff:ff')).longString,
			'13:ab:cd:00:00:00-13:ab:cd:02:ff:ff');
			
			/** connected left */
			A(mac.parseRanges('13:ab:cd:01:00:00-13:ab:cd:02:ff:ff').union(mac.parseRanges('13:ab:cd:00:00:00-13:ab:cd:00:ff:ff')).longString,
			'13:ab:cd:00:00:00-13:ab:cd:02:ff:ff');

			/** completed */
			A(mac.parseRanges('21:ab:cd:00:00:00-21:ab:cd:00:ff:ff + 21:ab:cd:02:00:00-21:ab:cd:02:ff:ff').union(
			  mac.parseRanges('21:ab:cd:01:00:00-21:ab:cd:01:ff:ff')).longString,
			'21:ab:cd:00:00:00-21:ab:cd:02:ff:ff');

			L('MAC pool union done.');
		}
		{
			L('MAC pool substract...');

			/** prefix */
			A(mac.parseRanges('21:ab:cd:00:00:00-21:ab:cd:00:ff:ff + 21:ab:cd:02:00:00-21:ab:cd:02:ff:ff').substract(
			  mac.parseRanges('21:ab:cd:00:00:00-21:ab:cd:00:02:ff')).longString,
			'21:ab:cd:00:03:00-21:ab:cd:00:ff:ff + 21:ab:cd:02:00:00-21:ab:cd:02:ff:ff');

			/** prefix range explicit */
			A(mac.parseRanges('21:bb:cd:00:00:00-21:bb:cd:00:ff:ff + 21:bb:cd:02:00:00-21:bb:cd:02:ff:ff').substract(
			  mac.parseRange('21:bb:cd:00:00:00-21:bb:cd:00:02:ff')).longString,
			'21:bb:cd:00:03:00-21:bb:cd:00:ff:ff + 21:bb:cd:02:00:00-21:bb:cd:02:ff:ff');
			
			/** prefix single explicit */
			A(mac.parseRanges('21:cb:cd:00:00:00-21:cb:cd:00:ff:ff + 21:cb:cd:02:00:00-21:cb:cd:02:ff:ff').substract(
			  mac.parse('21:cb:cd:00:00:00')).longString,
			'21:cb:cd:00:00:01-21:cb:cd:00:ff:ff + 21:cb:cd:02:00:00-21:cb:cd:02:ff:ff');
			
			L('MAC pool substract done.');
		}
		{
			L('MAC pool intersect...');

			/** prefix */
			A(mac.parseRanges('21:ab:cd:00:00:00-21:ab:cd:00:ff:ff + 21:ab:cd:02:00:00-21:ab:cd:02:ff:ff').intersect(
			  mac.parseRanges('21:ab:cd:00:00:00-21:ab:cd:00:02:ff')).longString,
			'21:ab:cd:00:00:00-21:ab:cd:00:02:ff');

			/** prefix range explicit */
			A(mac.parseRanges('21:bb:cd:00:00:00-21:bb:cd:00:ff:ff + 21:bb:cd:02:00:00-21:bb:cd:02:ff:ff').intersect(
			  mac.parseRange('21:bb:cd:00:00:00-21:bb:cd:00:02:ff')).longString,
			'21:bb:cd:00:00:00-21:bb:cd:00:02:ff');
			
			/** prefix single explicit */
			A(mac.parseRanges('21:cb:cd:00:00:00-21:cb:cd:00:ff:ff + 21:cb:cd:02:00:00-21:cb:cd:02:ff:ff').intersect(
			  mac.parse('21:cb:cd:00:00:00')).longString,
			'21:cb:cd:00:00:00');
			
			L('MAC pool intersect done.');
		}
		{
			L('MAC VfsPoolManager...');
			
			L("setting up 'ramfs' configuration...");
			
			const vfsTestPool = (function(){
				const vfs = require('ae3').vfs;
				import ru.myx.ae3.vfs.ram.StorageImplMemory;
				const ramfsRoot = vfs.createRoot( StorageImplMemory.create('tests-mac-ramfs') ).toContainer();
				return ramfsRoot.relativeFolder('range1');
			})();

			L("'ramfs' folder ready: " + vfsTestPool);

			if(false){
				const poolManager = mac.VfsPoolManager.create(vfsTestRoot);
				poolManager.load(true);
				poolManager.addRanges(mac.parseRanges('11:ab:cd:00:00:00-11:ab:cd:ff:ff:ff'));
				
				A(poolManager.initialPool.longString, 
				'11:ab:cd:00:00:00-11:ab:cd:ff:ff:ff');
				
				poolManager.store();
			}
			if(false){
				const poolManager = mac.VfsPoolManager.create(vfsTestRoot);
				poolManager.load(false);
				
				A(poolManager.poolInitial.longString, 
				'11:ab:cd:00:00:00-11:ab:cd:ff:ff:ff');
				
				A(poolManager.poolRemaining.longString, 
				'11:ab:cd:00:00:00-11:ab:cd:ff:ff:ff');
				
				A(poolManager.poolRemaining.macCount, 
				'16777216');
				
				const issued = poolManager.issueRange(1024, "order #12353521");
				
				A(issued.macCount, 
				'1024');
				
				A(issued.longString, 
				'11:ab:cd:00:00:00-11:ab:cd:00:03:ff');
				
				A(poolManager.poolInitial.longString, 
				'11:ab:cd:00:00:00-11:ab:cd:ff:ff:ff');
				
				A(poolManager.poolRemaining.macCount, 
				String(16777216 - 1024));
				
				A(poolManager.poolRemaining.longString, 
				'11:ab:cd:00:04:00-11:ab:cd:ff:ff:ff');
				
				poolManager.store();
			}
			
			L('MAC VfsPoolManager done.');
		}
		
		L('MAC done.');
	}
	
	/**
	 * IMEI
	 */
	{
		const imei = net.imei;
		// 49-015420-323751-8
		L('IMEI...');
		
		{
			L('IMEI parse single...');

			A(imei.parse('49-015420-323751-8'), 
			'49-015420-323751-8');
	
			A(imei.parse('49-015420-323751-8').imeiCount, 
			'1');
	
			A(imei.parse('49-015420-323751-8').longString, 
			'49-015420-323751-8');
			
			A(imei.parse('49-015420-323751-8:49-015420-323751-8').longString, 
			'49-015420-323751-8');
			
			A(imei.parse('49-015420-323751-8/1').longString, 
			'49-015420-323751-8');
			
			A(imei.parse('49-015420-323751-8').compactString, 
			'490154203237518');
			
			A(imei.parse('49-015420-323751-8').imeiAt(0), 
			'49-015420-323751-8');
			
			A(imei.parse('49-015420-323751-8').imeiAt(1), 
			'null');
			
			L('IMEI parse single done.');
		}
		
		L('IMEI done.');
	}
	
	L('done.');
	
	return "Successfully Passed";
};