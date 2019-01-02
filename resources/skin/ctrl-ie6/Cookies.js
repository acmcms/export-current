function getCookie(name) {
	var begin = document.cookie.indexOf(name + "=")
	if (begin == -1) {
		return false;
	}
	begin = document.cookie.indexOf("=", begin) + 1
	var end = document.cookie.indexOf("; ", begin)
	if (end == -1) {
		end = document.cookie.length
	}
	return document.cookie.substring(begin, end)
}

function setCookie(name, content, path) {
	var domain = '';
	var expDate = 'expires=Wednesday, 09-Aug-2020 00:00:00 GMT'
	path = (path) ? 'path=' + path + '; ' : ''
	document.cookie = name + '=' + content + '; ' + path + expDate + domain
}