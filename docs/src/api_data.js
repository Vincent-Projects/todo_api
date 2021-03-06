define({ "api": [
  {
    "type": "get",
    "url": "/auth/verify/:token",
    "title": "Verify the email token",
    "name": "GetVerifyToken",
    "group": "Authentication",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The token sent to user mailbox using email adress.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The Email of the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succes Response Example",
          "content": "{\n    \"email\": \"john@smith.com\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Log in a user",
    "name": "PostLogin",
    "group": "Authentication",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The user's email.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The user's password.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request Body Example :",
          "content": "{\n    \"email\": \"john@smith.com\",\n    \"password\": \"Strong@idh55\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The Email of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The authentication token that is required for any request. ( see Json Web Token )</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "token_expire",
            "description": "<p>The period of time in which the token is valid start at the login. ( Time given in seconds, 24 hours )</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response Example :",
          "content": "{\n    \"username\": \"john_smith\",\n    \"email\": \"john@smith.com\",\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\",\n    \"token_expire\": \"86400\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/auth/reset-password/link",
    "title": "Send email with reset token",
    "name": "PostResetPasswordSendLink",
    "group": "Authentication",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The user's email.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The user's email.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succes Response Example",
          "content": "{\n    \"email\": \"john@smith.com\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/auth/reset-password/:token",
    "title": "Verify Reset Password Token",
    "name": "PostResetPasswordVerifyToken",
    "group": "Authentication",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The token sent to user mailbox using user email adress. ( given as param to url )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The user's password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirmPassword",
            "description": "<p>The user confirm password. Must be the same as password.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request Body Example :",
          "content": "{\n    \"password\": \"Strong@idh55\",\n    \"confirmPassword\": \"Strong@idh55\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The Email of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The authentication token that is required for any request.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "token_expire",
            "description": "<p>The period of time in which the token is valid start at the login.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/auth/signup",
    "title": "Sign up a user",
    "name": "PostSignup",
    "group": "Authentication",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username. ( Sould be 3 characters length minimum, and 30 characters maximum )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The user's email.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The user's password. ( Should contains at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be 8 character length minimum )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm",
            "description": "<p>The user's confirm password. Must be the same as password field.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request Body Example :",
          "content": "{\n    \"username\": \"john_smith\",\n    \"email\": \"john@smith.com\",\n    \"password\": \"Strong@idh55\",\n    \"confirmPassword\": \"Strong@idh55\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "verification_token_expire",
            "description": "<p>Duration of token sent by email on verification link. ( 24 hours, then the activation link become invalid )</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Succes Response Example",
          "content": "{\n    \"verification_token_expire\": \"86400\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "delete",
    "url": "/todos/delete/:todoId",
    "title": "Delete task",
    "name": "DeleteTodo",
    "group": "Todos",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "todoId",
            "description": "<p>The id of the task to be deleted.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "todo",
            "description": "<p>The user's deleted task.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/todos.js",
    "groupTitle": "Todos"
  },
  {
    "type": "get",
    "url": "/todos",
    "title": "Get user's tasks",
    "name": "GetTodos",
    "group": "Todos",
    "version": "0.1.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "todos",
            "description": "<p>The user's tasks.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response Example :",
          "content": "{\n    \"todos\": [\n        {\n            \"id\": \"594d8az4f54fa8f4a5f6a4da\",\n            \"task\": \"Eat cookies\",\n            \"complete\": \"false\",\n             \"archived\": \"false\"\n        }          \n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/todos.js",
    "groupTitle": "Todos"
  },
  {
    "type": "post",
    "url": "/todos/add",
    "title": "Add new task",
    "name": "PostTodo",
    "group": "Todos",
    "version": "0.1.0",
    "header": {
      "examples": [
        {
          "title": "Request Example :",
          "content": "{\n    \"Content-Type\": \"application/json\",\n    \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "task",
            "description": "<p>The user task.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request Body Example",
          "content": "{\n    \"task\": \"Eat more cookies\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "todo",
            "description": "<p>The user new created task.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response Example",
          "content": "{\n     \"id\": \"594d8az4f54fa8f4a5f6a4da\",\n     \"task\": \"Eat more cookies\",\n     \"complete\": \"false\",\n     \"archived\": \"false\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/todos.js",
    "groupTitle": "Todos"
  },
  {
    "type": "put",
    "url": "/todos/update",
    "title": "Update task",
    "name": "PutUpdate",
    "group": "Todos",
    "version": "0.1.0",
    "description": "<p>The params here are optional, which means you can either update the task, complete or archived fields but not required to give all three if you just want to update the complete. But at least one of them are required.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id to the task to be deleted.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "task",
            "description": "<p>(optional) The modified task.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "complete",
            "description": "<p>(optional) A boolean represent if the task is complete or not.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "archived",
            "description": "<p>(optional) A boolean represent if the task is archived or not.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "todos",
            "description": "<p>The user's updated tasks.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object[]",
            "optional": false,
            "field": "errors",
            "description": "<p>Contains information about what's wrong for each fields.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Server Side error &amp; DB errors</p>"
          }
        ]
      }
    },
    "filename": "src/routes/todos.js",
    "groupTitle": "Todos"
  }
] });
