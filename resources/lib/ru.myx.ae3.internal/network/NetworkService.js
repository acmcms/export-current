
function startService(){
	require('java.class/ru.myx.ae3.transfer.nio.Main').main( null );
	require('java.class/ru.myx.ae3.transfer.tls.Main').main( null );

	return true;
}

function stopService(){
	return true;
};

exports.start = startService;
exports.stop = stopService;
