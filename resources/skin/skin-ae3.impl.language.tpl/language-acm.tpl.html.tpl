<html><body><h1>Language: ACM.TPL</h1>
<!-- <%FORMAT:'html'%><%
%><%OUTPUT: body %><%
	%><%= '<!' + '-- ' + 'begin' %><%
	%>-->
		<p>Abbreviation for Template Processing Language. A language specially crafted for its purpose.</p>
		<ul>
			<li>
				<h2>What does it give?</h2>
				<ul>
					<li>reach set of <a href="#tags">tags</a>;</li>
					<li>ability to embed code written on other languages;</li>
					<li>several <a href="#outputFormats">output formats</a>.</li>
				</ul>
			</li>
			<li>
				<h2>How does it look like?</h2>
				<ul>
					<li>
						CSS-file template. Formatted to be compatible with both, tpl-enabled server and standard static css file.
						<code><!-- <%FORMAT: 'no_ident' %> -->
							/* &lt;%<a href="#tagFINAL">FINAL</a>: 'text/css' %>&lt;%<a href="#tagFORMAT">FORMAT</a>: 'css' %><a href="#tplOUT" title="Syntax: in-line output">&lt;%=</a> '/' + '*' %> */
							HTML{ 
							&nbsp;	...
							}
							... /* some CSS code was here */
							TD, TH {
							&nbsp;	vertical-align: top;
							}
							/* &lt;%/FORMAT%>&lt;%/FINAL%> */
						<!-- <%/FORMAT%> --></code>
						<center><i>fig 1</i>. TPL css template example.</center>
					</li>
					<li>
						Server side javascript code container.
						<code><!-- <%FORMAT: 'no_ident' %> -->
							&lt;%<a href="#tagCODE">CODE</a>: 'ACM.ECMA' %>
								var settings = Request.getSettings();
								if( settings && settings.responsible ){
								&nbsp;	Runtime.SendMail(
								&nbsp;		From = settings.robot,
								&nbsp;		To = settings.responsible,
								&nbsp;		Subject = "ERROR(500): "+Request.getUrl(),
								&nbsp;		Format = "text",
								&nbsp;		Body = content.body
								&nbsp;	);
								}
								return {
								&nbsp;	title : "Ошибка выполнения",
								&nbsp;	body : "&lt;textarea wrap=off cols=80 rows=10 style='width:100%; height:400px'>"+content.body+"&lt;/textarea>",
								&nbsp;	template : "200"
								};
							&lt;%/CODE%>
						<!-- <%/FORMAT%> --></code>
						<center><i>fig 2</i>. TPL js container example.</center>
					</li>
					<li>
						As a response filter.
						<code><!-- <%FORMAT: 'no_ident' %> -->
							<a href="#tplCOMMENT" title="Syntax: comment">&lt;%
							&nbsp;	//</a> Slightly augments the response and passes it to 'html-page' template of 
							&nbsp;	// 'skin-standard-html' skin.
							
							%>&lt;%<a href="#tagOUTPUT">OUTPUT</a>: body %><a href="#tplEMPTY" title="Syntax: empty tag">&lt;%
							&nbsp;	%></a>&lt;body>&lt;%
							&nbsp;		%>&lt;h1><a href="#tplOUT" title="Syntax: in-line output">&lt;%
							&nbsp;			=</a> content.title || 'No title!' 
							&nbsp;		%>&lt;/h1>&lt;%
							&nbsp;		= content.body || 'No content!'
							&nbsp;		%>&nbsp;&lt;br />&lt;%
							&nbsp;	%>&lt;/body>&lt;%
							%>&lt;%/OUTPUT%>&lt;%
							%>&lt;%<a href="#tagRETURN">RETURN</a>:
							&nbsp;	Layouts.extend( content, {
							&nbsp;		template : 'html-page',
							&nbsp;		body : body
							&nbsp;	})
							%>
						<!-- <%/FORMAT%> --></code>
						<center><i>fig 3</i>. TPL augments content as a response filter.</center>
					</li>
					<li>
						Or anywhere else 8-)
						<center>
							<a href="$files/Screen shot 2011-02-19 at 21.15.07.gif">
								<img src="$files/Screen shot 2011-02-19 at 21.22.50.jpg" width="418" height="295" border="1" />
							</a><br>
							<i>fig 4</i>. Some crazy piece of TPL code (click for original image).
						</center>
					</li>
				</ul>
			</li>
			<li>
				<a name="tags"></a><h2>Tags</h2>
				<p>Tags are specified using <b>&lt;%</b> and <b>%></b> sequences. 
				Within <b>&lt;%</b> and <b>%></b> we specify tag name. 
				If tag has parameters then colon ('<b>:</b>') follows tag name 
				and parameters follow colon.</p>
				<p>Some tags expect embedded code, in this case embedded code
				should follow opening tag. <b>&lt;%/</b>&lt;tag-name><b>%></b> 
				sequence signals end of tag's embedded code. This way we
				can nest tags into other tags.</p>
				<ul>
					<li>
						<h3>List of tags</h3>
						<ul>
							<li><a href2="#tagAUDIT">AUDIT</a></li>
							<li><a href="#tagBREAK">BREAK</a></li>
							<li><a href="#tagCODE">CODE</a></li>
							<li><a href="#tagCONTINUE">CONTINUE</a></li>
							<li><a href="#tagCODE">EXEC</a></li>
							<li><a href2="#tagDEEPER">DEEPER</a></li>
							<li><a href="#tagFINAL">FINAL</a></li>
							<li><a href="#tagFOR">FOR</a></li>
							<li><a href="#tagFORMAT">FORMAT</a></li>
							<li><a href2="#tagIF">IF</a></li>
							<li><a href2="#tagIGNORE">IGNORE</a></li>
							<li><a href="#tagITERATE">ITERATE</a></li>
							<li><a href2="#tagLOG">LOG</a></li>
							<li><a href="#tagOUTPUT">OUTPUT</a></li>
							<li><a href2="#tagPROCESS">PROCESS</a></li>
							<li><a href2="#tagRECURSION">RECURSION</a></li>
							<li><a href2="#tagREDIRECT">REDIRECT</a></li>
							<li><a href="#tagRETURN">RETURN</a></li>
							<li><a href="#tagSQL">SQL</a></li>
							<li><a href2="#tagSQLBATCH">SQLBATCH</a></li>
							<li><a href2="#tagSQLUSE">SQLUSE</a></li>
							<li><a href="#tagTHROW">THROW</a></li>
							<li><a href="#tagWHILE">WHILE</a></li>
						</ul>
						Also:
						<ul>
							<li><a href="#tplEMPTY">Syntax: empty tag</a></li>
							<li><a href="#tplCOMMENT">Syntax: comment tag</a></li>
							<li><a href="#tplOUT">Syntax: in-line output</a></li>
						</ul>
					</li>
					<li>
						<a name="tplEMPTY"></a><h3>Syntax: empty tag</h3>
						<p>
							Syntax:
							<code>&lt;%%></code>
							OR
							<code>&lt;% &lt;white-space characters only>  %></code>
							Does really nothing. Can be used to eat whitespace where 
							whitespace is used only for readability and must be removed
							in the result of execution.
						</p>
					</li>
					<li>
						<a name="tplCOMMENT"></a><h3>Syntax: comment tag</h3>
						<p>
							Syntax:
							<code>&lt;%// &lt;anything>  %></code>
							OR
							<code>&lt;% &lt;white-space characters only> // &lt;anything>  %></code>
							Does really nothing. Just a comment.
						</p>
					</li>
					<li>
						<a name="tplOUT"></a><h3>Syntax: in-line output</h3>
						<p>
							Syntax:
							<code>&lt;%= &lt;expression>  %></code>
							OR
							<code>&lt;% &lt;white-space characters only> = &lt;expression>  %></code>
							Evaluates expression and outputs result into current output (which is assigned by <a href="#tagOUTPUT">OUTPUT</a> tag).
						</p>
					</li>
					<li>
						<a name="tagBREAK"></a><h3>Tag BREAK</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FOR: i = 0; i < 10; ++i %>
								&nbsp;...
								&nbsp;&lt;%BREAK%>
								&nbsp;...
								&lt%/FOR%>
							<!-- <%/FORMAT%> --></code>
							Breaks - jumps out of the enclosing loop.<br/>
						</p>
						<p>
							There are two more conditional variants of this tag:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FOR: i = 0; i < 10; ++i %>
								&nbsp;...
								&nbsp;&lt;%BREAK: IF: &lt;condition> %>
								&nbsp;...
								&lt%/FOR%>
							<!-- <%/FORMAT%> --></code>
							or
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FOR: i = 0; i < 10; ++i %>
								&nbsp;...
								&nbsp;&lt;%BREAK: UNLESS: &lt;condition> %>
								&nbsp;...
								&lt%/FOR%>
							<!-- <%/FORMAT%> --></code>
							The one with 'IF' will execute only when given condition 
							is TRUE. And the one with 'UNLESS" will execute only when 
							condition is FALSE.
						</p>
					</li>
					<li>
						<a name="tagCODE"></a><h3>Tag CODE</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%CODE: &lt;constant-language-name> %>
								&nbsp;... code here
								&lt%/CODE%>
							<!-- <%/FORMAT%> --></code>
							Embeds code in any supported language. Including: ACM.ECMA for Java Script.
						</p>
						<p>
							Example:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%EXEC: info = null %>
								&lt;%CODE: 'ACM.ECMA' %>
								&nbsp;
								&nbsp;function f1(x, y, z){
								&nbsp; &nbsp;...
								&nbsp;}
								&nbsp;
								&nbsp;var lcl = 0, ttl = 0;
								&nbsp;for(var i = 15; i >= 0; --i){
								&nbsp; &nbsp;ttl += f1(lcl, ttl, 7);
								&nbsp; &nbsp;lcl += f1(ttl, lcl, 3);
								&nbsp;}
								&nbsp;
								&nbsp;...
								&nbsp;
								&nbsp;info = { lcl : lcl, ttl : ttl };
								&nbsp;
								&lt%/CODE%>
							<!-- <%/FORMAT%> --></code>
							Embeds code in any supported language. Including: ACM.ECMA for Java Script.
						</p>
					</li>
					<li>
						<a name="tagCONTINUE"></a><h3>Tag CONTINUE</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FOR: i = 0; i < 10; ++i %>
								&nbsp;...
								&nbsp;&lt;%CONTINUE%>
								&nbsp;...
								&lt%/FOR%>
							<!-- <%/FORMAT%> --></code>
							Continues - jumps to the start of next iteration of the loop.<br/>
						</p>
						<p>
							There are two more conditional variants of this tag:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FOR: i = 0; i < 10; ++i %>
								&nbsp;...
								&nbsp;&lt;%CONTINUE: IF: &lt;condition> %>
								&nbsp;...
								&lt%/FOR%>
							<!-- <%/FORMAT%> --></code>
							or
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FOR: i = 0; i < 10; ++i %>
								&nbsp;...
								&nbsp;&lt;%CONTINUE: UNLESS: &lt;condition> %>
								&nbsp;...
								&lt%/FOR%>
							<!-- <%/FORMAT%> --></code>
							The one with 'IF' will execute only when given condition 
							is TRUE. And the one with 'UNLESS" will execute only when 
							condition is FALSE.
						</p>
					</li>
					<li>
						<a name="tagFINAL"></a><h3>Tag FINAL</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FINAL: &lt;content-type-string> %>
								&nbsp;...
								&lt%/FINAL%>
							<!-- <%/FORMAT%> --></code>
							Upon successful completion output of code embedded within
							will be returned as final (not intended for further skinning)
							response of contentType specified.
						</p>
					</li>
					<li>
						<a name="tagFOR"></a><h3>Tag FOR</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FOR: &lt;statementInit>; &lt;condition>; &lt;operation> %>
								&nbsp;...
								&lt%/FOR%>
							<!-- <%/FORMAT%> --></code>
							Runs a loop in a 'javascript-like' way: checking condition 
							before every iteration and performing operation after every 
							iteration. See <a href="#tagCONTINUE">CONTINUE</a> and 
							<a href="#tagBREAK">BREAK</a> for loop control.
						</p>
					</li>
					<li>
						<a name="tagFORMAT"></a><h3>Tag FORMAT</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%FORMAT: &lt;constant-format-string> %>
								&nbsp;...
								&lt%/FORMAT%>
							<!-- <%/FORMAT%> --></code>
							Allows to choose one of <a href="#outputFormats">formats</a> 
							available for parsing of code embedded within given FORMAT tag.
						</p>
					</li>
					<li>
						<a name="tagITERATE"></a><h3>Tag ITERATE</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%ITERATE: &lt;variable> : &lt;collectionExpression> %>
								&nbsp;...
								&lt%/ITERATE%>
							<!-- <%/FORMAT%> --></code>
							Runs a loop in a 'forEach-like' way: executing iteration
							for every collection element. Null collection works like
							an empty one. See <a href="#tagCONTINUE">CONTINUE</a> and 
							<a href="#tagBREAK">BREAK</a> for loop control.
						</p>
					</li>
					<li>
						<a name="tagOUTPUT"></a><h3>Tag OUTPUT</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%OUTPUT: &lt;writable variable or null> %>
								&nbsp;...
								&lt%/OUTPUT%>
							<!-- <%/FORMAT%> --></code>
							Collects all output from code embedded within this OUTPUT tag.
							Output is discarded when <b>null</b> is specified instead of
							variable.
						</p>
					</li>
					<li>
						<a name="tagRETURN"></a><h3>Tag RETURN</h3>
						<p>
							Syntax:
							<code>&lt;%RETURN: &lt;expression> %></code>
							Stops further execution of this script returning value
							which is result of evaluating the given expression.
						</p>
					</li>
					<li>
						<a name="tagSQL"></a><h3>Tag SQL</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%SQL: &lt;connectioNameExpression>, &lt;selectQueryExpression>[, ResultScope = "Record" ] %>
								&nbsp;...
								&lt%/SQL%>
							<!-- <%/FORMAT%> --></code>
							<div>
								Runs an iteration for every row in SQL SELECT query result-set.
								Columns are accessible by their names as properties of row
								object injected into execution context with name defined by
								<b>ResultScope</b> parameter and defaults to 'Record'.
								See <a href="#tagCONTINUE">CONTINUE</a> and 
								<a href="#tagBREAK">BREAK</a> for loop control.
							</div>
						</p>
						<p>
							Example (more conventional):
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%EXEC: csvText = '' %>
								&lt;%SQL: "library", "SELECT id, name FROM books ORDER BY name ASC" %>
								&nbsp;&lt;%EXEC: cvsText += Record.id + ',' + Record.name + '\r\n' %>
								&lt;%/SQL%>
							<!-- <%/FORMAT%> --></code>
						</p>
						<p>
							Example (most efficient):
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%OUTPUT: csvText %>&lt;%
								&nbsp; %>&lt;%SQL: "library", "SELECT id, name FROM books ORDER BY name ASC" %>&lt;%
								&nbsp; &nbsp;%>&lt;%= Record.id %>,&lt;%= Record.name %>&lt;%= '\r\n' %>&lt;%
								&nbsp; %>&lt;%/SQL%>&lt;%
								%>&lt;%/OUTPUT%>
							<!-- <%/FORMAT%> --></code>
						</p>
					</li>
					<li>
						<a name="tagTHROW"></a><h3>Tag THROW</h3>
						<p>
							Syntax:
							<code>&lt;%THROW: &lt;expression> %></code>
							Stops further execution of this script throwing value
							which is result of evaluating the given expression.
						</p>
					</li>
					<li>
						<a name="tagWHILE"></a><h3>Tag WHILE</h3>
						<p>
							Syntax:
							<code><!-- <%FORMAT: 'no_ident' %> -->
								&lt;%WHILE: &lt;condition> %>
								&nbsp;...
								&lt%/WHILE%>
							<!-- <%/FORMAT%> --></code>
							Runs a loop in a 'javascript-like' way: checking condition 
							before every iteration. See <a href="#tagCONTINUE">CONTINUE</a> and 
							<a href="#tagBREAK">BREAK</a> for loop control.
						</p>
					</li>
				</ul>
			</li>
			<li>
				<a name="outputFormats"></a><h2>Output format</h2>
				There are several output formats supported by parser. They allow 
				minimization of script output respecting format specified.
				<ul>
					<li>'default' - used by default, doesn't affect anything;</li>
					<li>'html' - remove extra whitespace for HTML;</li>
					<li>'xml' - remove extra whitespace for XML;</li>
					<li>'js' - remove extra whitespace and comments for JavaScript;</li>
					<li>'css' - remove whitespace and comments for CSS;</li>
					<li>'no_indent' - remove leading whitespace on every line.</li>
				</ul>
				Use <a href="#tagFORMAT">FORMAT</a> tag to switch between formats. 
				Tags could be nested.
			</li>
		</ul>
	<!-- <%= 'end. ' + '--' + '>' %><%
%><%/OUTPUT%><%
%><%RETURN: {
		title		: 'Language',
		template	: "html-document",
		body		: body
	} %><%
%><%
%><%/FORMAT%> --></body></html>