import ru.myx.codecs.CodecsHelper;

module.exports = CodecsHelper.baseAPI;
return;

const baseAPI = CodecsHelper.baseAPI;

module.exports = {
	unzipToMap : baseAPI.unzipToMap,
	untarToMap : baseAPI.untarToMap,
	untargzToMap : baseAPI.untargzToMap,
};