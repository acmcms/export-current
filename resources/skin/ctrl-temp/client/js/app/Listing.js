window.Listing || (Listing = parent.Listing) || (Listing = {
	strObjects : "Objects",
	init : function(target, id, url){
		target.id = id;
		target.listing = target;
		target.entryType = "setlist";
		target.frame = requireScript("app/Containers.js").createFrame(
					target,
					url,
					function(element){
						setTimeout(function(){
							var window = target.frame.contentWindow;
							window.listing = {
								id : id + "Frm",
								container : target
							};
							window.onLoad && window.onLoad();
						}, 0);
					});
		target.onFire = this.setListFire;
		target.path = url;
		window.router || (router = parent.router) || (requireScript("app/Router.js"), router = new Router("listing-list"));
		router.register(target, id + "Frm");
	},
	changeLocationSetList : function(path){
		var obj = this.listing;
		if(!obj.ini){
			obj.ini = Listing.setListInitialize;
			obj.ini();
		}
		router.fire('ChangeLocation', "listing", { path : path }, obj);
	},
	setListInitialize : function(){
		this.page = 0;
		this.location = this.frame.src;
		window.top.debug && window.top.debug("Listing: initialize, this=" + this.nodeName + ", location = " + this.location);
		router.register(mForm, this.id);
		this.paging = this.inner.ownerDocument.getElementById('TDPaging');
	
		this.showPaging = function(eValue){
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
			var title = eValue.title ? eValue.title : Listing.strObjects;
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
		};
		this.putResult = function(arr){
			this.returnValue = arr;
		};
		this.refresh = function(){
			this.lastScrollPosition = Dom.parentElement(this.frame.contentWindow.blockParent).scrollTop;
			router.fire('SetListRefresh',this.id,this.path,this);
			this.frame.setLocation(this.frame.contentWindow.document.location);
		};
		this.setLocation = function(){
			this.frame.setLocation(this.location + "&Page=" + this.page);
		};
	},
	setListFire : function(eType, eValue){
		if(!this.ini){
			this.ini = Listing.setListInitialize;
			this.ini();
		}
		switch(eType){
			case "setListPaging":
				this.showPaging(eValue);
				break;
			case "ItemSelect":
				this.putResult(eValue);
				router.fire('ItemSelect', this.id, {
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
				router.fire('ItemsSelect', this.id, {
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
				router.fire('ItemUnselect',this.id,false);
				break;
			case "SetListActive":
				this.returnValue = eValue;
				router.fire('SetListActive', this.id, {path : this.path});
				break;
		}
	}
})