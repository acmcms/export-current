/**
 * Show ISO MS GMT dates in user format and timezone
 */

var dateParseISO = (new Date('1970-01-01T00:00:00.001Z')).getTime() == 1
	? function(x){
		return new Date(x);
	}
	: function IE(string) {
		var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
			"(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
			"(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
		var d = string.match(new RegExp(regexp));
	
		var offset = 0;
		var date = new Date(d[1], 0, 1);
	
		d[3] && date.setMonth(d[3] - 1);
		d[5] && date.setDate(d[5]);
		d[7] && date.setHours(d[7]);
		d[8] && date.setMinutes(d[8]);
		d[10] && date.setSeconds(d[10]);
		d[12] && date.setMilliseconds(Number("0." + d[12]) * 1000);
		if (d[14]) {
			offset = (Number(d[16]) * 60) + Number(d[17]);
			offset *= ((d[15] == '-') ? 1 : -1);
		}
	
		offset -= date.getTimezoneOffset();
		time = date.getTime() + (offset * 60 * 1000);
		date.setTime(time);
		return date;
	};

function initDates(){
	var dates = document.querySelectorAll('date');
	for(var i = dates.length - 1; i >= 0; --i){
		var cell = dates[i];
		var value = cell.innerHTML;
		if(value.length === '2013-01-01T15:40:43.288Z'.length && value[4] === '-' && value[10] === 'T'){
			var date = dateParseISO(value);
			if(date.getTime() > 1){
				cell.setAttribute("title", value);
//				cell.innerHTML = date.toString();
//				cell.innerHTML = date.toLocaleString();
				cell.innerHTML = Layouts.Date.prototype.format("yyyy-MM-dd HH:mm ZZZZ", date);
			}
		}
	}
}
