<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script>
		// menu structure
		// v 2.0 %)
		/**
		 * That's how submenu works!
		 */
		submenu = window.submenu = [
			{ icon : "house", href : "home", title : "Home" },
			{ icon : "transmit", title : "Test Parameters", submenu : [
       			{ icon : "transmit", title : "Width", submenu : [
       				{ icon : "chart_curve", 
       					onclick : function(){document.getElementById('table').setAttribute('width','100%')},
						title : "Width: 100%" 
					},
       				{ icon : "chart_curve", 
       					onclick : function(){document.getElementById('table').setAttribute('width','auto')},
       					title : "Width: auto" 
       				},
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('width',(document.documentElement.clientWidth+0) + 'px')},
    					title : "Width: clientWidth" 
    				},
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('width',(document.documentElement.clientWidth+20) + 'px')},
    					title : "Width: clientWidth + 20" 
    				},
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('width','500px')},
    					title : "Width: 500px" 
    				},
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('width','1000px')},
    					title : "Width: 1000px" 
    				},
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('width','2000px')},
    					title : "Width: 2000px" 
    				}
    			] },
       			{ icon : "transmit", title : "Height", submenu : [
       				{ icon : "chart_curve", 
       					onclick : function(){document.getElementById('table').setAttribute('height','auto')},         title : "Height: auto" },
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('height',(document.documentElement.clientHeight+0) + 'px')},
    					title : "Height: clientHeight" },
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('height',(document.documentElement.clientHeight+20) + 'px')},
    					title : "Height: clientHeight + 20" },
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('height','500px')},
    					title : "Height: 500px" },
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('height','1000px')},
    					title : "Height: 1000px" },
    				{ icon : "chart_curve", 
    					onclick : function(){document.getElementById('table').setAttribute('height','2000px')},
    					title : "Height: 2000px" }
    			] }
			] },
			{ icon : "transmit", title : "Traffic", submenu : [
				{ icon : "chart_curve", href : "trafficdetail",         title : "Detail" },
				{ icon : "chart_line", href : "traffichistogram",      title : "Trend" }
			] },
			{ icon : "arrow_join", title : "Flood", submenu : [
				{ icon : "application_view_detail", href : "floodactivity",         title : "Activity" },
				{ icon : "chart_line", href : "floodhistogram",        title : "Trend" },
				{ icon : "chart_bar", href : "flooddistribution",        title : "Distribution" },
				{ icon : "report", href : "floodreport",           title : "Report" },
				{ icon : "medal_gold_1", href : "floodsources",   title : "Sources" },
				{ icon : "weather_lightning", href : "floodtargets",   title : "Targets" }
			] },
			{ icon : "arrow_divide", title : "Quarantine", submenu : [
				{ icon : "application_view_detail", href : "quarantineactivity",    title : "Activity" },
				{ icon : "chart_line", href : "quarantinehistogram",   title : "Trend" },
				{ icon : "report", href : "quarantinereport",      title : "Report" },
				{ icon : "medal_gold_1", href : "quarantinehitparade",   title : "Most Busted" },
				{ icon : "weather_lightning", href : "quarantinetargets",   title : "Top Targets" },
				{ icon : "wand", href : "quarantinemitigation",  title : "Mitigation" }
			] },
			{ icon : "zoom", title : "Ad-Hoc Sampling", submenu : [
				{ icon : "find", href : "samplingrequest",       title : "Sample Request" },
				{ icon : "application_view_detail", href : "samplinghistory",       title : "History" },
				{ icon : "report", href : "samplingreport",        title : "Report" }
			] },
			{ icon : "book_open", title : "Documentation", submenu : [
				{ icon : "html", href : "/doc/netDeflect.html/", title : "HTML" },
				{ icon : "page_white_acrobat", href : "/doc/netDeflect.pdf",   title : "PDF" }
			] },
			{ icon : "book_open", title : "Respect", submenu : [
				{ icon : "page_white_go", href : "http://famfamfam.com", title : "<font color=red>FAM</font><font color=lightblue>FAM</font><font color=green>FAM</font>" },
				{ icon : "page_white_go", href : "http://quirksmode.org/",   title : "<font face=courier>[quir</font><small>]</small>{<font face=courier>smode]</font>" }
			] },
			{ icon : "book_open", menusource : "/!/skin/skin-standard-xml/checkSubmenu.html?format=html-js",        title : "Recursive Menu" },
			{ icon : "door_open", href : "home?logout",        title : "Logout" }
		];
	</script>
</head>
<body>
</body>
</html>
