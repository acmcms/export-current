<%FORMAT:'html'%><%

//	content.title
//	content.defaultSource
//	content.previewFunction
//	content.showSource

%><%EXEC: title = 'Developer Tools: Try-It-Yourself: ' + content.title %><%

%><%EXEC: request = context?.query ?? Request.currentRequest %><%
%><%EXEC: parameters = request.parameters || {} %><%

%><%IF: parameters.preview %><%
	%><%EXEC: result = content.previewFunction(parameters.code || content.defaultSource) %><%
	%><%IF: result.template %><%
		%><%RETURN: result %><%
	%><%/IF%><%
	%><%FINAL: parameters.preview.split(' ')[0] == 'text' ? 'text/plain' : 'text/html' %><%
		= result;
	%><%/FINAL%><%
%><%/IF%><%


%><%OUTPUT: head %><%
	%><style><%FORMAT: 'css' %>
		BODY, HTML, FORM, TABLE, TEXTAREA, IFRAME {
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
		}
		BODY, HTML, FORM, TEXTAREA, IFRAME {
			display: block;
		}
		BODY, HTML, FORM, TABLE{
			position: relative;
			overflow: hidden;
		}
		TEXTAREA, IFRAME {
			position: absolute;
		}
		TEXTAREA {
			padding: 0;
			margin: 0;
			overflow: scroll;
		}
		TD {
			padding: 0;
			margin: 0;
			position: relative;
		}
	<%/FORMAT%></style><%
%><%/OUTPUT%><%

%><%OUTPUT: body %><%
	%><body>
		<form target="target" method="POST" enctype="multipart/form-data">
			<table border="0" cellpadding="0" cellspacing="0" style="tab1le-layout: fixed">
				<tr>
					<td width="33%" height="1px">
					<td width="67%" height="1px">
				</tr>
				<tr>
					<td colspan="2" height="2em">
						<h1><%= title %></h1>
					</td>
				</tr>
				<tr>
					<td width="33%" height="1em">
						<table border="0" cellpadding="0" cellspacing="0" border="0">
							<tr>
								<td align="left">
									Edit:&nbsp;
								</td>
								<td align="right">
									<%IF: content.showSource %>
										<input type="submit" name="preview" value="text &gt; &gt; &gt; " />
										<input type="submit" name="preview" value="html &gt; &gt; &gt; " />
									<%ELSE%>
										<input type="submit" name="preview" value="preview &gt; &gt; &gt; " /><br />
									<%/ELSE%><%
									%><%/IF%>
								</td>
							</tr>
						</table>
					</td>
					<td width="67%" height="1em">
						Preview:
					</td>
				</tr>
				<tr>
					<td width="33%" height="100%">
						<!--  this extra div is for IE6 IE7 -->
						<div style="width:100%;height:100%;border: 1px solid black;position:relative;overflow:hidden">
							<textarea id="code" name="code" wrap="off"><%= Format.xmlNodeValue( content.defaultSource ) %></textarea>
						</div>
					</td>
					<td width="67%" height="100%">
						<div style="width:100%;height:100%;border: 1px solid black;position:relative;overflow:hidden">
							<iframe id="target" name="target"></iframe>
						</div>
					</td>
				</tr>
			</table>
		</form>
	</body><%
%><%/OUTPUT%><%

%><%RETURN: Layouts.extend( content, {
	title		: title,
	template	: "html-page",
	useRequire	: true,
	head		: head,
	body		: body
}) %><%

%><%/FORMAT%>