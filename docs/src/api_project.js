define({
  "name": "TodoList API Docs",
  "version": "0.1.0",
  "description": "TodoList REST API made by <a href='https://github.com/Vincent-Projects'>@Vincent Rouilhac</a>",
  "title": "TodoList REST API",
  "sampleUrl": "http://138.68.119.174",
  "header": {
    "title": "Introduction",
    "content": "<h2>Introduction</h2>\n<p>This API is a TodoList that implement simple CRUD operation and an authentication system. As this API is a demo project, by default you cannot dirrectly create account, you first need to DM via my <a href=\"https://github.com/Vincent-Projects\">github profile</a> or via my <a href=\"https://twitter.com/Crys_Dev\">twitter profile</a> me in order to receive a code for creating an account to be able to test this API. This choice has been made to replicate as possible a real project, hosting, mailer service and database.</p>\n<p>The <a href=\"#api-Authentication\">Authentication</a> part describe the enpoints for the authentication system ad login, signup and account verification.\nThe <a href=\"#api-Todos\">Todos</a> part will dive into the enpoints that is used for the todo app, which implements the CRUD operation.</p>\n<h3>Status Code</h3>\n<h4>2xx</h4>\n<ul>\n<li>200 : Response OK</li>\n<li>201 : Ressource has been created</li>\n</ul>\n<h4>4xx</h4>\n<ul>\n<li>401 : Unauthorized to perform request</li>\n</ul>\n<h4>5xx</h4>\n<ul>\n<li>500 : This status code represent a server error.</li>\n</ul>\n<h3>Authentication &amp; Security</h3>\n<p>When a user is logged in ( token sent back from login endpoint ), to use todos endpoint you must provide the authenticated token. Otherwise the API will return an error response.\nThe token system uses Bearer which means that the token sent by the API must be provided using Bearer.\nThis Rest API uses JSON format as request and response data.</p>\n<p>Example of header:</p>\n<pre class=\"prettyprint lang-json\">{\n    \"Content-Type\": \"application/json\",\n    \"Authorization\": \"Bearer TOKEN_HERE\"\n}\n</pre>\n"
  },
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2021-02-11T21:50:03.639Z",
    "url": "https://apidocjs.com",
    "version": "0.26.0"
  }
});
