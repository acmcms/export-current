// <%FORMAT: 'js' %>
(window.app || (app = parent.app) || (app = {})) &&
app.Listing || (parent.app && (app.Listing = parent.app.Listing)) || (
	// v 1.0c
	//
	// -= MyX =-
	//
	//
	// app.Listing.prototype.path : Format.jsString( path )
	// app.Listing.prototype.strObjects : intl( en = "Files", ru = "Файлов" )
		
	//
	
	app.Listing = function(target, id, url, preload){
		this.target = target;
		target.listingObject = this;
		this.id = id;
		this.location = url;
		this.frame = null;
		this.entryType = "setlist";
		with(this){
			target.id = id;
			target.listing = target;
			frame = preload 
				? require("Utils.Comms").createFrameStatic(
					target,
					preload
				)
				: requireScript("/!/skin/ctrl-ie6-abstract/client/js/app/Containers.js").createFrame(
					target,
					url
				)
			;
			target.path = url;
		}
		this.page = 0;
		top.debug && top.debug("Listing: initialize, location = " + this.location);
		this.paging = (this.target.inner || this.target).ownerDocument.getElementById('TDPaging');
	},
	app.Listing.prototype = {
		strObjects : "Objects",
		changeLocationSetList : function(path){
			router.fire('ChangeLocation', "listing", { path : path }, this);
		},
		putResult : function(arr){
			this.returnValue = arr;
		},
		refresh : function(){
			this.lastScrollPosition = Dom.parentElement(this.frame.contentWindow.dtab).scrollTop;
			router.fire('SetListRefresh', this.id, this.path, this);
			router.fire('ItemUnselect', this.id);
			this.setLocation();
		},
		setLocation : function(){
			var url = this.location + "&Page=" + this.page;
			this.frame.setLocation 
				? this.frame.setLocation(url)
				: (
						this.target.removeChild(this.frame),
						this.frame = requireScript("/!/skin/ctrl-ie6-abstract/client/js/app/Containers.js").createFrame(
							this.target,
							url
						)
				)
			;
		},
		showPaging : function(eValue){
			var document = this.target.ownerDocument;
			this.goToPage = function(i){
				this.returnValue = false;
				this.page = (i == 'all') ? i : i-1;
				this.setLocation();
				oMenu.onFire('setListChangePage', 'path=' + this.path, this);
			};
			function createLink(listing, page, text){
				var link = document.createElement("a");
				link.setAttribute("href", "#");
				link.innerHTML = text;
				link.onclick = function(){
					listing.goToPage(page);
					return false;
				};
				return link;
			}
			var num = Number(eValue.size);
			var paging = this.paging;
			var title = eValue.title ? eValue.title : this.strObjects;
			paging.innerHTML = "<b>"+title+":</b> ";
			paging.appendChild(createLink(this, "all", num));
			if(eValue.length == 1){
				return;
			}

			var cp = eValue.page;
			var count = Number(eValue.count);
			var ppl = 10;
			var totalPages = Math.ceil(num/count);
			if (totalPages > 1){
				paging.appendChild(document.createTextNode(" \u00A0 "));
				var start = Math.ceil( (cp!='all' ? Number(cp) : 1)/ppl) * ppl - ppl + 1;
				var end = (totalPages >= start + ppl) ? start + ppl : totalPages + 1;
				if (start > 1){
					var span = document.createElement("span");
					span.style.lineHeight = "7px";
					span.appendChild(createLink(this, 1, "&#x25C4;")); // double-left (webdings 7) ???? wrong char
					span.appendChild(createLink(this, start - ppl, '&#x25C4;')); // left (webdings 3)
					paging.appendChild(span);
					paging.appendChild(document.createTextNode("\u00A0"));
				}
				var bold = document.createElement("b");
				for (var i = start; i < end; ++i){
					(i == cp) && bold.appendChild(document.createTextNode("["));
					bold.appendChild(createLink(this, i, i));
					(i == cp) && bold.appendChild(document.createTextNode("]"));
					bold.appendChild(document.createTextNode(" "));
				}
				paging.appendChild(bold);
				if (totalPages > start + ppl - 1){
					var span = document.createElement("span");
					span.style.lineHeight = "7px";
					span.appendChild(createLink(this, start + ppl, '&#x25BA;')); // right (webdings 4)
					span.appendChild(createLink(this, totalPages, '&#x25BA;')); // double-right (webdings 8) ???? wrong char
					paging.appendChild(span);
					paging.appendChild(document.createTextNode("\u00A0"));
				}
			}
		},
		onFire : function(eType, eValue){
			switch(eType){
				case "setListPaging":
					this.showPaging(eValue);
					break;
				case "ItemSelect":
					this.putResult(eValue);
					router.fire('ItemSelect',this.id,{
						path : this.path, 
						id : eValue[0].id.substr(3), 
						type : eValue[0].type || eValue[0].getAttribute("type")
					}, this);
					break;
				case "ItemsSelect":
					this.putResult(eValue);
					var ids = '';
					for(var i in eValue){
						ids += (i > 0 ? ',' : '') + eValue[i].id.substr(3);
					}
					router.fire('ItemsSelect',this.id,{
						path : this.path, 
						ids : ids, 
						type : 'content_multi'
					}, this);
					break;
				case "ItemActivate":
					this.putResult(eValue);
					router.fire('ItemActivate', this.id, (eValue[eValue.length-1].id == '..') 
							? { path : this.path.substr(0, this.path.lastIndexOf('/', this.path.length - 2) + 1), id : ''}
							: { path : this.path, id : eValue[eValue.length-1].id.substr(3) }, this);
					break;
				case "ItemUnselect":
					this.returnValue = eValue;
					router.fire('ItemUnselect', this.id);
					break;
				case "SetListActive":
					this.returnValue = eValue;
					router.fire('SetListActive',this.id,{
						path : this.path
					});
					break;
			}
		}
	},
app.Listing.setupListingFrame = function(window, path, data){
	with(window){
		window.router = {
			fire : function(eType, id, eValue, eObj){
				top.debug && top.debug("listing-list: router(" + this.name + "): fire: type=" + eType + ", id=" + id);
				listing.onFire(eType, eValue, eObj);
			}
		};

		window.hdiv = document.getElementById("hdiv");
		window.ddiv = document.getElementById("ddiv");
		
		window.htab = document.getElementById("htab");
		window.dtab = document.getElementById("dtab");

		window.selectedObjects = [];
		window.keySelectFlag = false;

		window.copyListToClipBoard = function(){
			if(selectedObjects < 1){
				return;
			}
			var txt = ''
			for(var i = 0; i < selectedObjects.length; ++i){
				oTR = selectedObjects[i];
				for(var j = 0; j < oTR.cells.length; j++){
					txt += oTR.cells[j].innerText + '\t';
				}
				txt += '\n';
			}
			window.clipboardData.setData('Text',txt)
		};
		
		window.clearArrFromNull = function(arr){
			var narr = [];
			for (var i = 0; i<arr.length; ++i){
				arr[i] != null && (narr[narr.length] = arr[i]);
			}
			return narr;
		};
		
		window.setColumnWidth = function(htab, ddiv, dtab){
			var hrow = htab.rows[0];
			var drow;
			var total = 10; /* table border + selector cell */
			var target  = [10];
			if(dtab.rows.length < 1 || dtab.rows[0].cells.length < 1){
				top.debug && top.debug("listing-list: resizing caption columns (no data)...");
				for (var i = 1; i < hrow.cells.length - 1; ++i){
					total += target[target.length] = Math.max(100, hrow.cells[i].offsetWidth);
				}
			}else{
				top.debug && top.debug("listing-list: resizing caption columns...");
				for(var row = 0; row < dtab.rows.length - 1; row++){
					drow = dtab.rows[row];
					if(!drow.cells[2].colSpan || drow.cells[2].colSpan == 1){
						for (var i = 1; i < drow.cells.length; ++i){
							total += target[target.length] = Math.max(
								Math.min((drow.cells[i].width || dtab.offsetWidth) + 20, drow.cells[i].offsetWidth),
								Math.min((hrow.cells[i].width || htab.offsetWidth) + 3, hrow.cells[i].offsetWidth));
						}
						break;
					}
				}
			}
			var clientWidth = (ddiv.clientWidth || ddiv.offsetWidth);
			if(clientWidth > total + 3){
				var padding = clientWidth - total;
				hrow.cells[hrow.cells.length - 1].style.padding = "0 0 0 " + (padding - 3) + "px";
				hrow.cells[hrow.cells.length - 1].style.display = "";
				total = clientWidth;
			}else{
				hrow.cells[hrow.cells.length - 1].style.display = "none";
			}
			for (var i = 1; i < target.length; ++i){
				var width = target[i];
				if(drow){
					var dcell = drow.cells[i];
					if(dcell.offsetWidth < width){
						var div = document.createElement("div");
						div.style.width = (width - 1 - 15 - 4) + "px";
						div.style.height = "1px";
						div.style.marginTop = "-1px";
						div.style.overflow = "hidden";
						dcell.appendChild(div);
						top.debug && dcell.offsetWidth != width && top.debug("listing-list: resize: invalid data row width: target=" + width + ", result=" + dcell.offsetWidth);
					}
				}
				var hcell = hrow.cells[i];
				if(hcell.offsetWidth < width){
					var div = document.createElement("div");
					div.style.width = (width - 1 - 2) + "px";
					div.style.height = "1px";
					div.style.marginTop = "-1px";
					div.style.overflow = "hidden";
					hcell.appendChild(div);
					top.debug && hcell.offsetWidth != width && top.debug("listing-list: resize: invalid header row width: target=" + width + ", result=" + hcell.offsetWidth);
				}
			}
			top.debug && top.debug("listing-list: resize: total=" + total + ", htab=" + htab.offsetWidth + " dtab=" + dtab.offsetWidth);
		};
		
		window.setPreviousValue = function(){
			if(!listing.target?.returnValue){
				return;
			}
			var arr = listing.target.returnValue;
			var flag = false;
			for (var i = 0; i < arr.length; ++i){
				try{
					var id = String(arr[i].id)
					var obj = document.getElementById(id);
					Dom.firstElement(obj).click();
					flag = true;
				}catch(Error){
					//
				}
			}
			flag || router.fire('ItemUnselect', listing.id);
		};
		
		window.sortTimerSubmit = function(fieldID,value){
			document.forms[0].sortfield.value=fieldID;
			document.forms[0].sortvalue.value=value;
			document.forms[0].submit();
		};

		window.onScroll = function(){
			htab.style.left = (- ddiv.scrollLeft) + "px";
		};
		
		window.onResize = function(){
			hdiv.style.width = (ddiv.clientWidth) + "px";
			htab && dtab && setColumnWidth(htab, ddiv, dtab);
		};

		onResize();

		document.oncontextmenu = function(){
			return true;
		};
		
		document.onselectstart = function(){
			return false;
		};
		
		document.onkeydown = function(e){
			e || (e = window.event);
			keySelectFlag = e.shiftKey 
				? 'shift' 
				: e.ctrlKey 
					? 'ctrl' 
					: false;
			if(keySelectFlag == 'ctrl' && e.keyCode == 67){
				copyListToClipBoard();
			}
		};
		
		document.onkeyup = function(){
			keySelectFlag = false;
		};
		
		document.ondblclick = function(e){
			e || (e = window.event);
			var obj = (e.srcElement || e.target);
			var selectParent = Dom.searchParentByAttribute(obj, "selectParent");
			// var selectParent = Dom.getSelectParent(obj,"selectParent");
			if (!selectParent){
				if (selectedObjects.length > 0){
					for (var i = 0; i < selectedObjects.length; ++i){
						Dom.unSelectBlock(selectedObjects[i].Childs);
						selectedObjects[i].select = false;
					}
					selectedObjects = [];
					router.fire('SetListUnselected', listing.id,false);
				}
				return;
			}
			if (!selectParent.isEntry){
				return;
			}
			selectParent.Childs || (selectParent.Childs = Dom.getSelectParentChild(selectParent));
			for (var i = 0; i < selectedObjects.length; ++i){
				Dom.unSelectBlock(selectedObjects[i].Childs);
				selectedObjects[i].select = false;
			}
			selectedObjects = [];
			Dom.selectBlock(selectParent.Childs);
			selectedObjects[0] = selectParent;
			selectParent.select = true;
			if (selectedObjects.length > 0){
				router.fire('ItemActivate', listing.id, selectedObjects);
			}
		};
		
		document.onclick = function(e){
			e || (e = window.event);
			var obj = (e.srcElement || e.target);
			var multipleFlag = (obj.selectFlag || keySelectFlag);
			var selectParent = Dom.searchParentByAttribute(obj, "selectParent");
			// var selectParent = Dom.getSelectParent(obj,"selectParent");
			htab.currentInput && htab.clearForm();
			if (!selectParent){
				if (!selectedObjects.length){
					return;
				}
				for (var i = 0; i < selectedObjects.length; ++i){
					Dom.unSelectBlock(selectedObjects[i].Childs);
					selectedObjects[i].select = false;
				}
				selectedObjects = [];
				router.fire('ItemUnselect',listing.id);
				return;
			}
			router.fire('SetListActive',listing.id,{
				path : path/* + selectParent.id.substr(3) */
			});
			selectParent.Childs || (selectParent.Childs = Dom.getSelectParentChild(selectParent));
			if (multipleFlag){
				switch(keySelectFlag){
				case 'shift':
					var startIndex = selectedObjects[selectedObjects.length-1].sourceIndex;
					var endIndex = selectParent.sourceIndex;
					var endFlag = false;
					var cObj;
					if(startIndex <= endIndex){
						cObj = selectedObjects[selectedObjects.length-1];
						endObj = selectParent;
					}else{
						cObj = selectParent;
						endObj = selectedObjects[selectedObjects.length-1];
					}
		
					while(!endFlag){
						if(cObj){
							if(!cObj.select){
								cObj.Childs || (cObj.Childs = Dom.getSelectParentChild(cObj));
								Dom.selectBlock(cObj.Childs);
								selectedObjects.push( cObj );
								cObj.select = true;
							}
						}
						endFlag = cObj == endObj || !cObj;
						cObj = cObj.nextSibling;
					}
					break;
				default:
					var alreadySelected = false;
					for (var i = 0; i < selectedObjects.length; ++i){
						if(selectedObjects[i] == selectParent){
							alreadySelected = true;
							Dom.unSelectBlock(selectParent.Childs);
							selectedObjects[i].select = false;
							selectedObjects[i] = null;
						}
					}
					selectedObjects = clearArrFromNull(selectedObjects);
					if (!alreadySelected){
						Dom.selectBlock(selectParent.Childs);
						selectedObjects.push( selectParent );
						selectParent.select = true;
					}
					break;
				}
			}else{
				if(selectParent.select && selectedObjects.length == 1){
					return;
				}
				for (var i = 0; i < selectedObjects.length; ++i){
					Dom.unSelectBlock(selectedObjects[i].Childs);
					selectedObjects[i].select = false;
				}
				selectedObjects = [];
				Dom.selectBlock(selectParent.Childs);
				selectedObjects[0] = selectParent;
				selectParent.select = true;
			}
		
			if (selectedObjects.length == 0){
				router.fire('ItemUnselect', listing.id);
			}else
			if (selectedObjects.length == 1){
				router.fire('ItemSelect', listing.id, selectedObjects);
			}else
			if (selectedObjects.length > 1){
				router.fire('ItemsSelect', listing.id, selectedObjects);
			}
		};

		router.fire(
			'setListPaging',
			listing.id,
			data
		);
		top.debug && top.debug("listing-list: onload event - initializing everything");
		window.onresize = onResize;
		ddiv.onscroll = onScroll;
		setColumnWidth(htab, ddiv, dtab);
		this.target && (Dom.parentElement(dtab).scrollTop = this.target.lastScrollPosition);
		setPreviousValue();
	}
},
app.Listing) // <%/FORMAT%>