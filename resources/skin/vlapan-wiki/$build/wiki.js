%>$().ready(function(){<%
	%>$(".siteMenu li").hide();<%
//	%>$(".siteMenu").corner("tl bl 20px");<%
	%>$(".siteMenu .control").click(<%
		%>function(){<%
			%>var text=$(this).text();<%
			%>var leftarrow=$("<span>&#8592;</span>");<%
			%>var rightarrow=$("<span>&#8594;</span>");<%
			%>$(this).find("span:last").remove();<%
			%>if(text==leftarrow.text()){<%
				%>$(".siteMenu li").show();<%
				%>$(this).append(rightarrow);<%
			%>}else{<%
				%>$(".siteMenu li").hide();<%
				%>$(this).append(leftarrow);<%
			%>}<%
		%>}<%
	%>);<%
//	%>$(".siteMenu li").corner("10px");<%
	%>$(".siteMenu li").hover(<%
		%>function(){<%
			%>$(this).find("a").css("color","#000");<%
			%>$(this).css("background","#fff");<%
		%>},<%
		%>function(){<%
			%>$(this).find("a").css("color","#ccc");<%
			%>$(this).css("background","#666");<%
		%>}<%
	%>);<%
	%>try{<%
		%>$('.worksList a').colorbox();<%
//		%>$('.worksList a').thickbox();<%
	%>}catch(e){};<%

//	%>$(".workItem,.categoryItem").hide();<%
//	%>$(".workItem,.categoryItem").fadeIn(1000);<%
	%>$("input,textarea").fadeTo("normal",0.6);<%
	%>$(".workItem img,.categoryItem img").fadeTo("normal",0.6);<%
	%>$(".workItem img,.categoryItem img").hover(<%
		%>function(){<%
			%>$(this).fadeTo(200,1);<%
		%>},function(){<%
			%>$(this).fadeTo(1,0.6);<%
		%>});<%
%>});<%