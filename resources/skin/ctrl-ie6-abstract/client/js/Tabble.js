// <%FORMAT: 'js' %>
window.Tabble || (Tabble = function(target){
		this.target = target;
		this.table = document.createElement("table");
		this.panes = [];
		this.current = undefined;
		with(this){
			table.setAttribute("border", 0);
			table.setAttribute("cellspacing", 0);
			table.setAttribute("cellpadding", 0);
			table.setAttribute("width", "100%");
			table.setAttribute("height", "100%");
		}
	},
	Tabble.prototype = {
		onBlur : function(){
			this.current === undefined || this.panes[this.current].onBlur();
			this.current = undefined;
		},
		switchTab : function(n){
			if(this.current === n || n < 0 || n >= this.panes.length){
				return;
			}
			this.current === undefined || this.panes[this.current].onBlur();
			this.current != n && this.panes[n].onFocus();
			this.current = n;
		},
		finish	: function(){
			with(this){
				if(!panes.length){
					null("No panes added!");
				}
				var splitters = new TabbleSplitters(this, table.insertRow(-1).insertCell(-1));
				switchTab(0);
				target.appendChild(table);
			}
		},
		/**
		 * element.onFocus() mandatory
		 * element.onBlur() optional
		 */
		addPane	: function(title, element){
			with(this){
				var row = table.insertRow(-1);
				element.onBlur || (element.onBlur = function(){});
				panes.push(new TabblePane(title, row, element));
			}
		},
		undefined		: Tabble.UNDEFINED
	},
	window.TabblePane || (TabblePane = function(title, row, element){
			this.title = title;
			this.row = row;
			element.onFocus || null("onFocus method is mandatory");
			element.onBlur || null("onBlur method is mandatory");
			this.element = element;
			row.style.display = "none";
			var cell = row.insertCell(-1);
			cell.className = "BorderBox";
			cell.style.height = "100%";
			cell.appendChild(element.firstChild);
		},
		TabblePane.prototype = {
			onBlur	:	function(){
				with(this){
					row.style.display = "none";
					element.onBlur();
				}
			},
			onFocus	:	function(){
				with(this){
					row.style.display = "";
					element.onFocus();
				}
			},
			undefined		: TabblePane.UNDEFINED
		},
	TabblePane),
	window.TabbleSplitters || (TabbleSplitters = function(tabble, target){
			this.tabble = tabble;
			this.table = document.createElement("table");
			with(this){
				this.rowLine = table.insertRow(-1);
				rowLine.className = "border";
				this.rowTabs = table.insertRow(-1);
				this.panes = tabble.panes;
				table.setAttribute("width", "100%");
				table.className = "zakladka BorderBox";
				create();
				target.appendChild(table);
			}
		},
		TabbleSplitters.prototype = {
			create	: function(){
				with(this){
					for(var i = 0; i < panes.length; ++i){
						var line = [rowLine.insertCell(-1),rowLine.insertCell(-1),rowLine.insertCell(-1)];
						line[0].className = "TabOn";
						line[1].className = "TabOn";
						line[2].className = "TabOn";
						var pane = panes[i];
						var tab = [rowTabs.insertCell(-1),rowTabs.insertCell(-1),rowTabs.insertCell(-1)];
						var cell = tab[1];
						cell.line = line;
						cell.tab = tab;
						cell.innerHTML = pane.title;
						cell.index = i;
						cell.onclick = function(){
							tabble.switchTab(this.index);
						};
					}
					{
						/**
						 * last one - spacer
						 */
						var cell = rowLine.insertCell(-1);
						cell.setAttribute("width", "100%");
					}
					{
						/**
						 * last one - spacer
						 */
						var cell = rowTabs.insertCell(-1);
						cell.setAttribute("width", "100%");
						cell.innerHTML = "&nbsp;";
					}
				}
			},
			<%FORMAT: 'xml' %><%
				%><%OUTPUT: tabSplitter1 %><%
					%><table border=0 cellpadding=0 cellspacing=0><%
						%><tr><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
							%><td bgcolor=buttonshadow><%
								%><img height=16 width=1><%
							%></td><%
							%><td bgcolor=buttonhighlight><%
								%><img height=16 width=1><%
							%></td><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td bgcolor=buttonshadow><%
								%><img height=1 width=1><%
							%></td><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
							%><td bgcolor=buttonhighlight><%
								%><img height=1 width=1><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td><%
								%><img height=3 width=1><%
							%></td><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
						%></tr><%
					%></table><%
				%><%/OUTPUT%><%
				%><%OUTPUT: tabSplitter2 %><%
					%><table border=0 cellpadding=0 cellspacing=0><%
						%><tr><%
							%><td><%
							%></td><%
							%><td bgcolor=buttonhighlight><%
								%><img height=16 width=1><%
							%></td><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
							%><td bgcolor=buttonhighlight><%
								%><img height=1 width=1><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td><%
								%><img height=3 width=2><%
							%></td><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
						%></tr><%
					%></table><%
				%><%/OUTPUT%><%
				%><%OUTPUT: tabSplitter3 %><%
					%><table border=0 cellpadding=0 cellspacing=0><%
						%><tr><%
							%><td bgcolor=buttonhighlight><%
								%><img height=18 width=1><%
							%></td><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td><%
							%></td><%
							%><td bgcolor=buttonhighlight><%
								%><img height=1 width=1><%
							%></td><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
							%><td bgcolor=buttonshadow><%
								%><img height=1 width=2><%
							%></td><%
						%></tr><%
					%></table><%
				%><%/OUTPUT%><%
				%><%OUTPUT: tabSplitter4 %><%
					%><table border=0 cellpadding=0 cellspacing=0><%
						%><tr><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
							%><td bgcolor=buttonshadow><%
								%><img height=18 width=1><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
							%><td bgcolor=buttonshadow><%
								%><img height=1 width=1><%
							%></td><%
							%><td><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td bgcolor=buttonshadow><%
								%><img height=1 width=2><%
							%></td><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
						%></tr><%
					%></table><%
				%><%/OUTPUT%><%
				%><%OUTPUT: tabSplitter5 %><%
					%><table border=0 cellpadding=0 cellspacing=0><%
						%><tr><%
							%><td><%
								%><img height=1 width=1><%
							%></td><%
							%><td bgcolor=buttonshadow><%
								%><img height=16 width=1><%
							%></td><%
							%><td><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td bgcolor=buttonshadow><%
								%><img height=1 width=1><%
							%></td><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
						%></tr><%
						%><tr><%
							%><td><%
							%></td><%
							%><td><%
							%></td><%
							%><td><%
								%><img height=3 width=2><%
							%></td><%
						%></tr><%
					%></table><%
				%><%/OUTPUT%><%
			%><%/FORMAT%>
			
			tabSplitter1	: <%= Format.jsString(tabSplitter1) %>,
			tabSplitter2	: <%= Format.jsString(tabSplitter2) %>,
			tabSplitter3	: <%= Format.jsString(tabSplitter3) %>,
			tabSplitter4	: <%= Format.jsString(tabSplitter4) %>,
			tabSplitter5	: <%= Format.jsString(tabSplitter5) %>,
			
			undefined		: TabbleSplitters.UNDEFINED
		},
	TabbleSplitters),
Tabble) // <%/FORMAT%>