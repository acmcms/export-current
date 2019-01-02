var TimeControl = {
	timeShift : 0,
	// should be initialized before usage
	textModeFromDateDetail : "starting at",
	textModeFromDateTrend : "starting on",
	textModeBeforeNow : "before now",
	textModeBeforeDay : "before day",
	textModeBeforeWeek : "before week",
	textModeBeforeMonth : "before month",
	textModeBeforeYear : "before year",
	
	// should be initialized before usage
	textTimezoneTitle : "timezone",
	
	// should be initialized before usage
	iconTimezone16x16 : "timezone.png",
	
	// should be initialized before usage
	monthNames : {
		0:	'month1',
		1:	'month2',
		2:	'month3',
		3:	'month4',
		4:	'month5',
		5:	'month6',
		6:	'month7',
		7:	'month8',
		8:	'month9',
		9:	'monthA',
		10: 'monthB',
		11: 'monthC'
		},

	// should be initialized before usage
	periodMultipleNames : { 0: 'minutes', 1: 'hours', 2: 'days', 3: 'weeks', 4: 'months', 5: 'years' },
	periodSingleNames : { 0: 'minute', 1: 'hour', 2: 'day', 3: 'week', 4: 'month', 5: 'year' },

	// should be initialized before usage
	timeZonePlainArray : [],
	
	// initialized from initialize method - true when mode == "detail"
	modeDetail: undefined,
	// initialized from initialize method - true when mode == "detail" || mode == "trend"
	modeTrend: undefined,
	// initialized from initialize method
	textModeFromDate : undefined,
	
	//////////////////////////
	//////////////////////////
	// COMMON FUNCTIONS
	//

	
	//////////////////////////
	//////////////////////////
	// DATE FUNCTIONS
	//
	zoomIn : function(dateStart, dateEnd, dateCenter){
		var diff = (dateEnd - dateStart) / 3;
		if(diff < 10 * 60000){
			return;
		}
		diff = TimeControl.setLength(diff);
		if(dateCenter){
			TimeControl.setDate(new Date(dateCenter - diff / 2));
		}else
		if(TimeControl.mode.value != 0){
			TimeControl.setDate(new Date(dateStart + diff / 2));
		}
	},
	
	zoomOut : function(dateStart, dateEnd, dateCenter){
		var diff = (dateEnd - dateStart) * 3;
		if(diff > 3 * 365 * 24 * 60 * 60000){
			return;
		}
		diff = TimeControl.setLength(diff);
		if(dateCenter){
			TimeControl.setDate(new Date(dateCenter - diff / 2));
		}else
		if(TimeControl.mode.value != 0){
			TimeControl.setDate(new Date(dateStart - diff / 4));
		}
	},
	
	isBeforeNow : function(){
		return (TimeControl.mode.value == 0);
	},
	
	setDate : function(date){
		if(TimeControl.mode.value == 0){
			TimeControl.mode.value = 1;
			TimeControl.mode.itemChange();
		}
		date.setTime( date.getTime() + TimeControl.timezone.offset * 60000 );
		TimeControl.year.value = date.getUTCFullYear();
		TimeControl.month.value = date.getUTCMonth();
		TimeControl.day.value = date.getUTCDate();
		if(TimeControl.modeDetail){
			TimeControl.hour.value = date.getUTCHours();
			TimeControl.minute.value = date.getUTCMinutes();
		}
	},

	setLength : function(millis){
		if(millis > 2.9 * 7 * 24 * 60 * 60000){
			TimeControl.period.value = 3;
			var count = Math.round(millis / 7.0 / 24.0 / 60.0 / 60000.0);
			TimeControl.count.value = count;
			return count * 7 * 24 * 60 * 60000;
		}
		if(millis > 2.9 * 24 * 60 * 60000){
			TimeControl.period.value = 2;
			var count = Math.round(millis / 24.0 / 60.0 / 60000.0);
			TimeControl.count.value = count;
			return count * 24 * 60 * 60000;
		}
		if(millis > 2.9 * 60 * 60000){
			TimeControl.period.value = 1;
			var count = Math.round(millis / 60.0 / 60000.0);
			TimeControl.count.value = count;
			return count * 60 * 60000;
		}
		{
			TimeControl.period.value = 0;
			var count = Math.max(1, Math.round(millis / 60000.0));
			TimeControl.count.value = count;
			return count * 60000;
		}
	},

	// the idea is to make date object which will display real time in selected timezone as a UTC time.
	zoneDate : function(date){
		date || (date = new Date());
		date.setTime(date.getTime() - (new Date().getTimezoneOffset()) * 60000 + (new Date().getTimezoneOffset() + TimeControl.timezone.offset) * 60000 + this.timeShift * 60000);
		return date;
	},

	implDefaultUpdateState : function(){
		if(!TimeControl.mode.started){
			return;
		}
		var mode = parseInt(TimeControl.mode.value);
		if(!this.disabled && mode == 0){
			this.disabled = true;
			return;
		}
		if(TimeControl.modeDetail){
			if(this.disabled && mode != 0){
				this.disabled = false;
				return;
			}
		}else{
			var period = this.maxPeriod >= parseInt(TimeControl.period.value);
			if(this.disabled && mode != 0 && period){
				this.disabled = false;
				return;
			}
			if(!this.disabled && mode != 0 && !period){
				this.disabled = true;
				return;
			}
		}
	},

	implDefaultDisable : function(){
	},

	implDefaultEnable : function(){
	},

	updateFields: function() {
		with(TimeControl){
			if(modeDetail){
				minute.itemUpdate();
				hour.itemUpdate();
			}
			day.itemUpdate();
			month.itemUpdate();
			year.itemUpdate();
		}
	},

	updateButtons: function() {
		if(parseInt(this.mode.value) == 0){
			this.btnNext.className = "icon-next-disable";
			this.btnPrev.className = "icon-prev-disable";
			return;
		}
		var currentDate = TimeControl.currentDate();
		var nextDisable;
		var prevDisable;
		switch(parseInt(this.period.value)){
		case 0:
		case 1:
		case 2:
			nextDisable = parseInt(this.day.value) >= 31 && parseInt(this.month.value) >= 11 && parseInt(this.year.value) > currentDate.getFullYear();
			prevDisable = parseInt(this.day.value) <= 1 && parseInt(this.month.value) <= 0 && parseInt(this.year.value) <= 2004;
			break;
		case 3:
			nextDisable = parseInt(this.day.value) >= (31-7) && parseInt(this.month.value) >= 11 && parseInt(this.year.value) > currentDate.getFullYear();
			prevDisable = parseInt(this.day.value) <= 7 && parseInt(this.month.value) <= 0 && parseInt(this.year.value) <= 2004;
			break;
		case 4:
			nextDisable = parseInt(this.month.value) >= 11 && parseInt(this.year.value) > currentDate.getFullYear();
			prevDisable = parseInt(this.month.value) <= 0 && parseInt(this.year.value) <= 2004;
			break;
		case 5:
			nextDisable = parseInt(this.year.value) > currentDate.getFullYear();
			prevDisable = parseInt(this.year.value) <= 2004;
			break;
		}
		this.btnNext.className = nextDisable ? "icon-next-disable" : "icon-next";
		this.btnPrev.className = prevDisable ? "icon-prev-disable" : "icon-prev";
	},
	
	dateStartFromFields : function(fields){
		var date = new Date();
		date.setTime(0);
		date.setUTCFullYear(parseInt(fields.tyr));
		date.setUTCMonth(parseInt(fields.tmt));
		date.setUTCDate(parseInt(fields.tdy));
		date.setUTCHours(TimeControl.modeDetail ? parseInt(fields.thr) : 0);
		date.setUTCMinutes(TimeControl.modeDetail ? parseInt(fields.tmn) : 0);
//		date.setTime(Math.round(date.getTime() / 60000.0 - (date.getTimezoneOffset() + TimeControl.timezone.offset)) * 60000);
		date.setTime(Math.round(date.getTime() / 60000.0 + date.getTimezoneOffset() - (date.getTimezoneOffset() + TimeControl.timezone.offset)) * 60000);
		return date;
	},

	dateEndFromFields : function(fields){
		var date = TimeControl.dateStartFromFields(fields); 
		var value = parseInt(fields.tct);
		if(isNaN(value) || value <= 0){
			value = 1;
		}
		switch(parseInt(fields.tpr)){
			case 5:
				date.setUTCFullYear( date.getUTCFullYear() + value );
				break;
			case 4:
				date.setUTCMonth( date.getUTCMonth() + value );
				break;
			case 3:
				date.setUTCDate( date.getUTCDate() + value * 7 );
				break;
			case 2:
				date.setUTCDate( date.getUTCDate() + value );
				break;
			case 1:
				date.setUTCHours( date.getUTCHours() + value );
				break;
			case 0:
				date.setUTCMinutes( date.getUTCMinutes() + value );
				break;
		}
		return date;
	},
	
	currentDate : function(){
		var date = TimeControl.zoneDate(new Date());
		TimeControl.modeDetail && TimeControl.mode.timer && date.setTime( date.getTime() + 60000 );
		var value = parseInt(TimeControl.count.value);
		(isNaN(value) || value <= 0) &&	(value = 1);
		switch(parseInt(TimeControl.period.value)){
			case 5:
				if(TimeControl.modeDetail){
					date.setUTCFullYear( date.getUTCFullYear() - value );
				}else{
					date.setUTCFullYear( date.getUTCFullYear() + 1 - value );
					date.setUTCMonth( 0 );
					date.setUTCDate( 1 );
					date.setUTCHours( 0 );
					date.setUTCMinutes( 0 );
				}
				break;
			case 4:
				if(TimeControl.modeDetail){
					var original = date.getUTCMonth();
					date.setUTCMonth( original - value );
					value < 12 && original == date.getUTCMonth() && date.setUTCDate( 1 );
				}else{
					date.setUTCMonth( date.getUTCMonth() + 1 - value );
					date.setUTCDate( 1 );
					date.setUTCHours( 0 );
					date.setUTCMinutes( 0 );
				}
				break;
			case 3:
				if(TimeControl.modeDetail){
					date.setUTCDate( date.getUTCDate() - value * 7 );
				}else{
					date.setUTCDate( date.getUTCDate() + 7 - value * 7 );
					while(date.getUTCDay() != 1){
						date.setUTCDate( date.getUTCDate() - 1);
					}
					date.setUTCHours( 0 );
					date.setUTCMinutes( 0 );
				}
				break;
			case 2:
				if(TimeControl.modeDetail){
					date.setUTCDate( date.getUTCDate() - value );
				}else{
					date.setUTCDate( date.getUTCDate() + 1 - value );
					date.setUTCHours( 0 );
					date.setUTCMinutes( 0 );
				}
				break;
			case 1:
				TimeControl.modeDetail && date.setUTCHours( date.getUTCHours() - value );
				break;
			case 0:
				TimeControl.modeDetail && date.setUTCMinutes( date.getUTCMinutes() - value );
				break;
		}
		date.setSeconds( 0 );
		date.setMilliseconds( 0 );
		return date;
	},

	checkMonday: function(day) {
		var date = TimeControl.zoneDate(new Date());
		date.setUTCFullYear(parseInt(TimeControl.year.value));
		date.setUTCMonth(parseInt(TimeControl.month.value));
		date.setUTCDate(day);
		return date.getUTCDay() == 1;
	},

	prevDay: function(){
		var dy = parseInt(TimeControl.day.value);
		if(dy > 1) {
			TimeControl.day.value = dy - 1;
			return true;
		}
		if(TimeControl.prevMonth()){
			var newDy = TimeControl.getDaysInMonth();
			if(newDy > TimeControl.day.options.length){
				TimeControl.setDaysInMonth();
			}
			TimeControl.day.value = newDy;
			return true;
		}
		return false;
	},

	prevWeek: function(){
		for(var i=7;i>0;i--){
			if(!TimeControl.prevDay()){
				return false;
			}
		}
		return true;
	},

	prevMonth: function(){
		var mt = parseInt(TimeControl.month.value);
		if(mt > 0) {
			TimeControl.month.value = mt - 1;
			return true;
		}
		if(TimeControl.prevYear()){
			TimeControl.month.value = 11;
			return true;
		}
		return false;
	},

	prevYear: function(){
		var yr = parseInt(TimeControl.year.value);
		if(yr <= 2004){
			return false;
		}
		TimeControl.year.value = yr - 1;
		return true;
	},

	getDaysInMonth: function () {
		switch(parseInt(TimeControl.month.value)) {
			case 3:
			case 5:
			case 8:
			case 10:
				return 30;
			case 1:
				var yr = parseInt(TimeControl.year.value);
				if(yr % 4 == 0) {
					if((yr % 100 == 0) && (yr % 400 != 0)) {
						return 28;
					}
					return 29;
				}
				return 28;
		}
		return 31;
	},

	setDaysInMonth: function() {
		var e = TimeControl.day;
		var dy = parseInt(e.value);
		var days = TimeControl.getDaysInMonth();
		if(e.options.length == 1){
			e.options[0] = new Option("01", 1);
		}
		if(e.options.length < days){
			for(var i=e.options.length; (i++)<days; ){
				e.options[i-1] = new Option(i<10?'0'+i:i, i);
			}
		}
		var firstEnable = undefined;
		var lastEnable = undefined;
		for(var i=1; i<=e.options.length; i++){
			var enable = i <= days && (TimeControl.modeDetail || TimeControl.period.value != 3 || TimeControl.checkMonday(i));
			e.options[i-1].disabled = !enable;
			if(enable){
				if(!lastEnable){
					firstEnable = i;
				}
				lastEnable = i;
			}
			if(!enable && dy == i){
				dy = lastEnable;
			}
		}
		if(dy){
			e.value = Math.min( dy, lastEnable );
		}else{
			e.value = firstEnable;
			TimeControl.prevWeek();
		}
	},

	dateClickPrev : function (e){
		e || (e = window.event);
		e.cancelBubble = true;
		e.returnValue = false;
		e.stopPropagation && e.stopPropagation();
		e.preventDefault && e.preventDefault();

		if(TimeControl.btnPrev.className.indexOf("disable") >= 0){
			if(parseInt(TimeControl.mode.value) == 1){
				return false;
			}
			TimeControl.mode.value = 1;
			if(TimeControl.mode.timer){
				clearInterval( TimeControl.mode.timer );
				TimeControl.mode.timer = undefined;
			}
		}

		switch(parseInt(TimeControl.period.value)) {
			case 0:
			case 1:
			case 2:
				TimeControl.prevDay();
				break;
			case 3:
				TimeControl.prevWeek();
				break;
			case 4:
				TimeControl.prevMonth();
				break;
			case 5:
				TimeControl.prevYear();
				break;
		}
		TimeControl.setDaysInMonth();
		TimeControl.updateButtons();
		Engine.valueChange(null);
		Engine.updateAll(true);
		return false;
	},

	dateClickNext : function(e){
		e || (e = window.event);
		e.cancelBubble = true;
		e.returnValue = false;
		e.stopPropagation && e.stopPropagation();
		e.preventDefault && e.preventDefault();

		if(TimeControl.btnNext.className.indexOf("disable") >= 0){
			if(parseInt(TimeControl.mode.value) == 1){
				return false;
			}
			TimeControl.mode.value = 1;
			if(TimeControl.mode.timer){
				clearInterval( TimeControl.mode.timer );
				TimeControl.mode.timer = undefined;
			}
		}

		function nextDay(){
			var dy = parseInt(TimeControl.day.value);
			if(dy < TimeControl.getDaysInMonth()) {
				TimeControl.day.value = dy + 1;
				return true;
			}
			if(nextMonth()){
				TimeControl.day.value = 1;
				return true;
			}
			return false;
		}

		function nextWeek(){
			for(var i=7;i>0;i--){
				if(!nextDay()){
					return false;
				}
			}
			return true;
		}

		function nextMonth(){
			var mt = parseInt(TimeControl.month.value);
			if(mt < 11) {
				TimeControl.month.value = mt + 1;
				return true;
			}
			if(nextYear()){
				TimeControl.month.value = 0;
				return true;
			}
			return false;
		}

		function nextYear(){
			var yr = parseInt(TimeControl.year.value);
			if(yr >= (TimeControl.currentDate().getFullYear() + 1)){
				return false;
			}
			TimeControl.year.value = yr + 1;
			return true;
		}

		switch(parseInt(TimeControl.period.value)) {
			case 0:
			case 1:
			case 2:
				nextDay();
				break;
			case 3:
				nextWeek();
				break;
			case 4:
				nextMonth();
				break;
			case 5:
				nextYear();
				break;
		}
		TimeControl.setDaysInMonth();
		TimeControl.updateButtons();
		Engine.valueChange(null);
		Engine.updateAll(true);
		return false;
	},
	
	formatDate : function(date){
		function formatTime(date, offset, zone){
			function d2(number){
				return number < 10 ? '0' + number : number;
			}
			return 	date.getFullYear() + '-' + 
					d2(date.getUTCMonth() + 1) + '-' + 
					d2(date.getUTCDate()) + ' ' + 
					d2(date.getUTCHours()) + ':' + 
					d2(date.getUTCMinutes()) /* + ':' + 
					d2(date.getUTCSeconds()) */ + (zone ? '' : (' ' + 
															(offset == 0 ? "" : 
																	((offset < 0) ? '-' : '+') +
																	d2(Math.floor(Math.abs(offset) / 60)) + ':' +
																	d2(Math.abs(offset) % 60))));
		}
		return TimeControl.timezone 
			? formatTime(TimeControl.zoneDate(date), TimeControl.timezone.offset, true)
			: formatTime(date, date.getTimezoneOffset(), false);
	},
	
	timeValuesExplicit : false,
	
	implTimeWriteValue: function(value, restore){
		if(value == undefined || value == null){
			for(var i=this.options.length-1; i >= 0; i--) {
				var current = this.options[i];
				if(current.defaultSelected) {
					current.selected = true;
					return;
				}
	 		}
	 		this.selectedIndex = 0;
			return;
		}
		if( restore && TimeControl.mode.value == 0 ){
			TimeControl.mode.value = 1;
			TimeControl.mode.itemChange();
		}
		if( (this.value == (this.value = value)) || TimeControl.timeValuesExplicit ){
			return;
		}
		if( TimeControl.mode.value == 0 && value != this.itemDefault() ){
			TimeControl.timeValuesExplicit = true;
			top.debug && top.debug("TimeControl field '"+this.id+"' updated explicitly, explicit flag set");
		} 
	},
	
	// main initialization method - inserts time control on the current place
	// mode - one of "none", "trend", "detail"
	initialize : function(mode){
		// '| 0' converts number to integer that is closer to zero
		window.serverTimestamp && (this.timeShift = ((serverTimestamp - (new Date().getTime())) / 60000) | 0, top.debug && top.debug( "TimeControl: Time correction: Need to add: " + this.timeShift + " full minutes"));
		TimeControl.modeDetail = (mode == "detail");
		TimeControl.modeTrend = TimeControl.modeDetail || (mode == "trend");
		if(TimeControl.modeTrend){
			TimeControl.textModeFromDate = TimeControl.modeDetail ? TimeControl.textModeFromDateDetail : TimeControl.textModeFromDateTrend;
		}
		document.write("<span id='timecontrolspan'></span>");
		var target = document.getElementById("timecontrolspan");
		// functions
		function insertPadding(){
			var padding = document.createElement("span");
			padding.innerHTML = "&nbsp;";
			target.appendChild(padding);
		}
		// count ant type : available in detail and trend modes
		if(TimeControl.modeTrend){
			insertPadding();
			// count
			{
				var input = document.createElement("input");
				input.setAttribute("skip", "true");
				input.id = "tct";
				input.type = "text";
				input.value = "1";
				input.size = "3";
				input.useCookies = true;
				input.itemRequired = true;
				input.itemDefault = 1;
				input.itemInit = function(value){
					value !== undefined && (this.value = value);
				};
				input.onfocus = function(){
					this.valueSaved = -1;
				};
				input.onblur = function(){
					this.valueSaved = -1;
				};
				input.itemChange = function(){
					var value = parseInt( this.value );
					var realValue = (isNaN(value) || value === undefined || value <= 0) ? '1' : String(value);
					if(value != this.valueSaved){ // prevents field updates in WebKit (at least)
						this.value = realValue;
						this.valueSaved = realValue;
						value = realValue;
						TimeControl.period.updateOptions();
						TimeControl.mode.updateNow(false);
					}
				};
				TimeControl.count = input;
				target.appendChild(input);
				Engine.fieldRegister(input);
			}
			insertPadding();
			// period
			{
				var select = document.createElement("select");
				select.id = "tpr";
				select.useCookies = true;
				select.itemDefault = 2;
				select.periodMultiple = TimeControl.periodMultipleNames;
				select.periodSingle = TimeControl.periodSingleNames;
				select.itemInit = function(value){
					var periods = (parseInt(TimeControl.count.value) == 1) ? this.periodSingle : this.periodMultiple;
					this.options.length = 0;
					for(var i in periods){
						if( (TimeControl.modeDetail ? (i < 5) : (i > 1)) ){
							var option = new Option(periods[i], i);
							this.options[this.options.length] = option;
							if(i == value){
								option.selected = true;
							}
						}
					}
				};
				select.itemWriteValueFix = function(requestedValue, realValue){
					top.debug && top.debug("TIMECONTROL: period value fix: requestedValue="+requestedValue+", realValue="+realValue);
					requestedValue = parseInt(requestedValue);
					realValue = parseInt(realValue);
					top.debug && top.debug("TIMECONTROL: period value fix: requestedValue="+requestedValue+", realValue="+realValue);
					if(requestedValue >= 0 && requestedValue < realValue && realValue < 6){
						for(var value = requestedValue; value < realValue; value++){
							switch(value){
							case 0: TimeControl.count.value = Math.ceil(parseInt(TimeControl.count.value) / 60.0);
								break;
							case 1: TimeControl.count.value = Math.ceil(parseInt(TimeControl.count.value) / 24.0);
								break;
							case 2: TimeControl.count.value = Math.ceil(parseInt(TimeControl.count.value) / 7.0);
								break;
							case 3: TimeControl.count.value = Math.ceil(parseInt(TimeControl.count.value) / 4.0);
								break;
							case 4: TimeControl.count.value = Math.ceil(parseInt(TimeControl.count.value) / 12.0);
								break;
							}
						}
					}
				};
				select.updateOptions = function(){
					var periods = (parseInt(TimeControl.count.value) == 1) ? this.periodSingle : this.periodMultiple;
					for(var i = this.options.length-1; i>=0; i--){
						this.options[i].text = periods[ this.options[i].value ];
					}
				};
				select.itemChange = function(){
					var value = parseInt(this.value);
					switch(value){
					case 5: TimeControl.month.itemDisable();
					case 4: TimeControl.day.itemDisable();
					case 3:
					case 2: TimeControl.modeDetail && TimeControl.hour.itemDisable();
					case 1: TimeControl.modeDetail && TimeControl.minute.itemDisable();
					}
					switch(value){
					case 0: TimeControl.modeDetail && TimeControl.minute.itemEnable();
					case 1:	TimeControl.modeDetail && TimeControl.hour.itemEnable();
					case 2:
					case 3: TimeControl.day.itemEnable();
					case 4:	TimeControl.month.itemEnable();
					}
					TimeControl.mode.updateOptions();
					TimeControl.updateButtons();
					TimeControl.updateFields();
					TimeControl.mode.updateNow(false);
				};
				TimeControl.period = select;
				target.appendChild(select);
				Engine.fieldRegister(select);
			}
			insertPadding();
			// mode
			{
				var select = document.createElement("select");
				select.id = "tmd";
				select.useCookies = true;
				select.itemDefault = "0";
				select.getBeforeTitle = function(){
					if(TimeControl.modeDetail){
						return TimeControl.textModeBeforeNow;
					}
					switch(parseInt(TimeControl.period.value)){
					case 2: return TimeControl.textModeBeforeDay;
					case 3: return TimeControl.textModeBeforeWeek;
					case 4: return TimeControl.textModeBeforeMonth;
					case 5: return TimeControl.textModeBeforeYear;
					default: return TimeControl.textModeBeforeNow;
					}
				};
				select.itemInit = function(value){
					this.options.length = 0;
					this.options[0] = new Option(this.getBeforeTitle(), 0);
					this.options[1] = new Option(TimeControl.textModeFromDate, 1);
					this.value = this.previousValue = -1;
				};
				select.updateOptions = function(){
					this.options[0].text = this.getBeforeTitle();
				};
				select.updateNow = function(callUpdateAll){
					function update(field){
						return String(field.value) != String(field.value = field.itemDefault());
					}
					if(TimeControl.mode.timer){
						var updated = false;
						updated |= TimeControl.modeDetail && update(TimeControl.minute);
						updated |= TimeControl.modeDetail && update(TimeControl.hour);
						updated |= update(TimeControl.day);
						updated |= update(TimeControl.month);
						updated |= update(TimeControl.year);
						updated && callUpdateAll && (TimeControl.count.value != '') && Engine.updateAll(true);
					}
				};
				select.itemChange = function(submit){
					if(parseInt(this.value) == 0){
						Engine.autoCommit(true);
						TimeControl.mode.timer || (TimeControl.mode.timer = setInterval("TimeControl.mode.updateNow(true)", 999));
					}else{
						Engine.autoCommit(false);
						if(TimeControl.mode.timer){
							clearInterval( TimeControl.mode.timer );
							TimeControl.mode.timer = undefined;
						}
					}
					if(submit && TimeControl.timeValuesExplicit){
						top.debug && top.debug("TimeControl: submit action - explicit flag cleared!");
						TimeControl.timeValuesExplicit = false;
						this.previousValue = -1;
					}
					if(this.previousValue != this.value){
						this.previousValue = this.value;
						var dynamic = (parseInt(this.value) == 0);
						top.debug && top.debug("TimeControl mode change: " + this.value + ", explicitValues=" + TimeControl.timeValuesExplicit + ", newDynamicTimeFields=" + dynamic);
						if(TimeControl.modeDetail){
							TimeControl.minute.dynamic = dynamic;
							TimeControl.hour.dynamic = dynamic;
						}
						TimeControl.day.dynamic = dynamic;
						TimeControl.month.dynamic = dynamic;
						TimeControl.year.dynamic = dynamic;
						TimeControl.mode.dynamic = !dynamic;
					}
					TimeControl.mode.started = true;
					TimeControl.updateButtons();
					TimeControl.updateFields();
					TimeControl.mode.updateNow(false);
				};
				TimeControl.mode = select;
				target.appendChild(select);
				Engine.fieldRegister(select);
			}
		}
		// time control : available in detail mode only
		if(TimeControl.modeDetail){
			insertPadding();
			// hour
			{
				var select = document.createElement("select");
				select.id = "thr";
				for(var i=0; i<24; i++){
					select.options[i] = new Option(i<10?'0'+i:i, i);
				}
				select.useCookies = true;
				select.itemDefault = function(){
					return TimeControl.currentDate().getUTCHours();
				};
				select.maxPeriod = 1;
				select.itemUpdate = TimeControl.implDefaultUpdateState;
				select.itemDisable = TimeControl.implDefaultDisable;
				select.itemEnable = TimeControl.implDefaultEnable;
				select.itemWriteValue = TimeControl.implTimeWriteValue;
				TimeControl.hour = select;
				target.appendChild(select);
				Engine.fieldRegister(select);
			}
			target.appendChild(document.createTextNode(" : "));
			// minute
			{
				var select = document.createElement("select");
				select.id = "tmn";
				for(var i=0; i<60; i++){
					select.options[i] = new Option(i<10?'0'+i:i, i);
				}
				select.useCookies = true;
				select.itemDefault = function(){
					return TimeControl.currentDate().getUTCMinutes();
				};
				select.maxPeriod = 0;
				select.itemUpdate = TimeControl.implDefaultUpdateState;
				select.itemDisable = TimeControl.implDefaultDisable;
				select.itemEnable = TimeControl.implDefaultEnable;
				select.itemWriteValue = TimeControl.implTimeWriteValue;
				TimeControl.minute = select;
				target.appendChild(select);
				Engine.fieldRegister(select);
			}
			insertPadding();
		}
		// date control : available in detail and trend modes
		if(TimeControl.modeTrend){
			insertPadding();
			// previous
			{
				var button = document.createElement("img");
				button.className = "icon-prev";
				button.src = "images/blank.gif";
				TimeControl.btnPrev = button;
				target.appendChild(button);
				Utils.Event.listen(button, "click", TimeControl.dateClickPrev);
			}
			insertPadding();
			// day
			{
				var select = document.createElement("select");
				select.id = "tdy";
				select.useCookies = true;
				select.itemDefault = function(){
					return TimeControl.currentDate().getUTCDate();
				};
				select.maxPeriod = 3;
				select.itemUpdate = TimeControl.implDefaultUpdateState;
				select.itemDisable = TimeControl.implDefaultDisable;
				select.itemEnable = TimeControl.implDefaultEnable;
				select.itemWriteValue = TimeControl.implTimeWriteValue;
				select.itemInit = function(value){
					TimeControl.setDaysInMonth();
					this.value = Math.min( Math.max( value, 1 ), this.options.length );
				};
				select.itemChange = function(){
					TimeControl.updateButtons();
				}
				TimeControl.day = select;
				target.appendChild(select);
				Engine.fieldRegister(select);
			}
			insertPadding();
			// month
			{
				var select = document.createElement("select");
				select.id = "tmt";
				for(var i in TimeControl.monthNames){
					select.options[select.options.length] = new Option(TimeControl.monthNames[i], i);
				}
				select.useCookies = true;
				select.itemDefault = function(){
					return TimeControl.currentDate().getUTCMonth();
				};
				select.maxPeriod = 4;
				select.itemUpdate = TimeControl.implDefaultUpdateState;
				select.itemDisable = TimeControl.implDefaultDisable;
				select.itemEnable = TimeControl.implDefaultEnable;
				select.itemWriteValue = TimeControl.implTimeWriteValue;
				select.itemChange = function(){
					TimeControl.setDaysInMonth();
					TimeControl.updateButtons();
				}
				TimeControl.month = select;
				target.appendChild(select);
				Engine.fieldRegister(select);
			}
			insertPadding();
			// year
			{
				var select = document.createElement("select");
				select.id = "tyr";
				for(var i = (new Date()).getFullYear() + 1; i> 2003; i--){
					select.options[select.options.length] = new Option(i, i);
				}
				select.useCookies = true;
				select.itemDefault = function(){
					return TimeControl.currentDate().getUTCFullYear();
				};
				select.maxPeriod = 5;
				select.itemUpdate = TimeControl.implDefaultUpdateState;
				select.itemDisable = TimeControl.implDefaultDisable;
				select.itemEnable = TimeControl.implDefaultEnable;
				select.itemWriteValue = TimeControl.implTimeWriteValue;
				select.itemChange = function(){
					TimeControl.setDaysInMonth();
					TimeControl.updateButtons();
				};
				TimeControl.year = select;
				target.appendChild(select);
				Engine.fieldRegister(select);
			}
			insertPadding();
			// next
			{
				var button = document.createElement("img");
				button.className = "icon-next";
				button.src = "images/blank.gif";
				TimeControl.btnNext = button;
				target.appendChild(button);
				Utils.Event.listen(button, "click", TimeControl.dateClickNext);
			}
			insertPadding();
		}
		// timezone data : available in any mode
		{
			var defaultKey = TimeControl.timezoneKey(TimeControl.timezoneDefault);
			TimeControl.timezoneDefault.key = defaultKey;
			TimeControl.timezoneDefault.gmt = TimeControl.timezoneFormatOffset(TimeControl.timezoneDefault.offset);
			TimeControl.timezoneMap = {};
			TimeControl.timezoneMap[defaultKey] = TimeControl.timezoneDefault;
			TimeControl.timezoneMenu = { icon: TimeControl.iconTimezone16x16, title : TimeControl.timezoneDefault.short, menusource : "timezone_submenu" };
		}
		// timezone control : available in any mode
		{
			insertPadding();
			// timezone
			{
				var button = document.createElement("button");
				button.setAttribute('type', 'button');	//  submit is default value in w3c specs, button.type= doesn't work in any browser
				button.style.cursor = "pointer";
				button.title = TimeControl.textTimezoneTitle;
				button.id = "ttz";
				button.useCookies = true;
				button.ignoreNoCookies = true;
				button.itemDefault = function(){
					return TimeControl.timezoneDefault.key;
				};
				button.itemReadValue = function(){
					return this.val; // Aucking IE use 'value' field as a shortcut for 'innerHTML'... much shorter??? 8-)
				};
				button.itemWriteValue = function(value, second){
					if(!TimeControl.timezoneMap[value]){
						if(second){
							alert("Unknown timezone: " + value);
							button.itemWriteValue(TimeControl.timezoneDefault.key);
							return;
						}
						top.debug && top.debug("Timezone list requested: unknown timezone: " + value);
						Utils.Comms.queryPlain("timezone_submenu?type=js", function(code, text){
							top.debug && top.debug("Timezone list loaded");
							eval(text);
							top.debug && top.debug("Timezone list parsed");
						});
					}
					var zone = TimeControl.timezoneMap[value] || TimeControl.timezoneMap[value = TimeControl.timezoneDefault.key];
					this.val = value; // Aucking IE use 'value' field as a shortcut for 'innerHTML'... much shorter??? 8-)
					TimeControl.timezoneMenu.setTitle(zone.short);
					this.offset = zone.offset;
					this.title = TimeControl.textTimezoneTitle + ' ' + zone.short + ' ' + zone.gmt + ' ' + zone.name;
				};
				TimeControl.timezone = button;
				target.appendChild(button);
				Engine.fieldRegister(button);
				Menu.attachMenu(button, TimeControl.timezoneMenu);
				button.itemWriteValue(TimeControl.timezoneDefault.key);
			}
		}
		// date control initialization : available in detail and trend modes
		if(TimeControl.modeTrend){
			TimeControl.setDaysInMonth();
			TimeControl.updateButtons();
			TimeControl.updateFields();
		}
	},

	timezoneFormatOffset : function(minutes){
		function d2(number){
			return number < 10 ? '0' + number : number;
		}
		return "(GMT" + (minutes == 0 ? "" : 
					((minutes < 0) ? '-' : '+') +
					d2(Math.floor(Math.abs(minutes) / 60)) + ':' +
					d2(Math.abs(minutes) % 60)) + ')';
	},

	timezoneKey : function(zone){
		return zone.short + ',' + zone.raw + ',' + zone.master;
	},
	
	timezoneInfoLoad : function(zoneList){
		var mapZones = {};
		
		var mapRegions = {};
		var mapOther = {
			title : "Other",
			hash : {},
			submenu : [],
			register : function(key, zone){
				if(!this.hash[key]){
					this.hash[key] = zone;
					this.submenu.push(zone);
				}
			}
		};
		
		function MenuMap(region){
			this.title = region;
			this.hash = {};
			this.submenu = [];
			this.register = function(key, zone){
				if(!this.hash[key]){
					this.hash[key] = zone;
					this.submenu.push(zone);
				}
			}
		}
		
		var zoneClick = function(){
			if(TimeControl.modeDetail){
				var date = new Date();
				date.setUTCFullYear(parseInt(TimeControl.year.value));
				date.setUTCMonth(parseInt(TimeControl.month.value));
				date.setUTCDate(parseInt(TimeControl.day.value));
				date.setUTCHours(parseInt(TimeControl.hour.value));
				date.setUTCMinutes(parseInt(TimeControl.minute.value));
				date.setUTCSeconds( 0 );
				date.setUTCMilliseconds( 0 );
				date.setTime( date.getTime() - (TimeControl.timezone.offset - this.offset) * 60000 );
				TimeControl.year.value = date.getUTCFullYear();
				TimeControl.month.value = date.getUTCMonth();
				TimeControl.day.value = date.getUTCDate();
				TimeControl.hour.value = date.getUTCHours();
				TimeControl.minute.value = date.getUTCMinutes();
			}
			TimeControl.timezone.itemWriteValue(this.key);
			Engine.updateAll(true);
		};

		for(var i = 0; i < zoneList.length; i++){
			var zone = zoneList[i];
			if(!zone || zone.short.indexOf('+') != -1){
				continue;
			}
			zone.gmt = TimeControl.timezoneFormatOffset(zone.offset);
			var regionIndex = zone.id.indexOf('/');
			if(regionIndex < 0){
				zone.region = undefined;
				zone.location = undefined;
				zone.title = zone.gmt + ' ' + zone.name;
			}else{
				zone.region = zone.id.substring(0, regionIndex);
				if(zone.region == "SystemV" || zone.region == "Etc"){
					continue;
				}
				zone.location = zone.id.substring(regionIndex + 1).replace(/_/g, ' ');
				zone.title = zone.gmt + ' ' + zone.location;
			}
			var key = zone.key = TimeControl.timezoneKey(zone);
			mapZones[key] = zone;
			if(zone.region){
				var regionMap = (mapRegions[zone.region] || (mapRegions[zone.region] = { title : zone.region, hash : {} })).hash;
				(regionMap[key] || (regionMap[key] = [])).push(zone);
			}else{
				zone.onclick = zoneClick;
				mapOther.register(key, zone);
			}
		}
		
		var listRegions = [];
		for(var i in mapRegions){
			var region = mapRegions[i];
			var menu = {
				title   : region.title,
				submenu : []
			};
			for(var i in region.hash){
				var array = region.hash[i];
				var offset = TimeControl.timezoneFormatOffset(array[0].offset);
				var text = undefined;
				for(var i = 0;i < array.length;){
					var zone = array[i++];
					text = (text ? text + ", " : "") + zone.location;
					if(text.length > 120 || i == array.length){
						menu.submenu.push({
							title   : offset + " " + text,
							key		: zone.key,
							offset	: zone.offset,
							onclick : zoneClick
						});
						text = undefined;
					}
				}
			}
			listRegions.push(menu);
		}
		listRegions.sort(function(a,b){
			return ((a.title < b.title) ? -1 : ((a.title > b.title) ? 1 : 0));
		});

		listRegions.push(mapOther);
		TimeControl.timezoneMap = mapZones;
		return listRegions;
	}
};