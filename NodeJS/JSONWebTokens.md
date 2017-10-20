# JSON Web Tokens (JWT)

[Learn how JWT Works](https://jwt.io/)

[Github Page for `jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken)

**Steps** to Install and Use JWT:

- ***Install*** json web token NPM module: `npm install --save jsonwebtoken`
- ***Require*** the module in our server: `var jwt = require('jsonwebtoken');`
- We need to maintain a ***secret key*** that will be used. We can save this in the config file:

```javascript
// config.js:
config.jwt.secretKey = process.env.JWT || 'developmentsecretkey';
```

- Setup a ***route*** to create an ***authenticate*** a user using JWT:

```javascript
app.post('/auth', function(req, res, next) {
    // ...Do JWT Auth stuff...
});
```

- First step is to ***sign*** the user in: 
  - In this step, the user provides username/email and password and we will ***verify*** if such a user exists (and passwords match)
  - If user is verified, we will ***create a JWT signature*** from user's basic DB details which will serve as a ***token*** to the user with (**`jwt.sign(objToSign, secretKey, { expiresIn: <valueInSecs> })`**. `expiresIn` can be replaced with `expiresInMinutes` to provide value in minutes. This token can be used next time onwards by the user to do other stuff. Hence, the ***user/client must save the token*** for use next time.
  - From then on, the token will be passed by the user to the server, which allows him to do authenticated operatioxns.

```javascript
// routes.js:
var authController = require('./authcontroller');
app.post('/auth/signin', authController.signInUser);

// authcontroller.js:
exports.signInUser = function signInUser(req, res, next) {
	var email = req.body.email,
		password = req.body.password;

	// if no username or password then send a message:
    if (!email || !password) {
      next(new Error('You need an email and password'));
    } else {
    	UserModel.findOne({ email: email, password: password })
    		.then(function(user) {
    			var userIdEml = {
    					_id: user._id,
    					email: user.email
	    			};

	    		var token = jwt.sign(userIdEml, config.jwt.secretKey, { 
	    				expiresIn: config.jwt.expiresIn
	    			});

	    		res.json({
	    			success: true,
	    			token: token
	    		});
    		})
    		.catch(function(err) {
    			next(err);
    		});
    }
};

// Example input:
/* http post localhost:3000/auth/signin email=pushkar@test.com password=mypass */

// Example output:
/* {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWU5MDQ2NTNjM2RkZTk3MDc5YmYwZTciLCJlbWFpbCI6InB1c2hrYXJAdGVzdC5jb20iLCJpYXQiOjE1MDg1MjQ4NzEsImV4cCI6MTUwOTM4ODg3MX0.libu95Vcwb7b1m5t1dpsT3IQwt2B7pbWYXOofHBxHqE"
} */
```

Use the **`jwt.verify(token, secret)`** method to verify a token and get the decoded signed message (which created the token in the first place). This authentication can be placed as a ***middleware*** before sensitive operations that require user to be signed in.

```javascript
// authController.js:
exports.authenticate = function(req, res, next) {
	/* Allow token to be passed in the request body or as a header */
	var token = req.body.token || req.headers['token'];
	if(token) {
		var decodedUser = jwt.verify(token, config.jwt.secretKey);
		UserModel.findById(decodedUser._id)
			.then(function(user) {
				/* Check if decoded user is the same one who's userid is set in params */
				if(req.params.userid) { // Only if userid is included in params (url)
					console.log(req.params.userid);
					console.log(user._id);
					if(req.params.userid == user._id) {
						next();
					} else {
						next(new Error('Cannot access another user\'s account'));
					}
				} else {
					next(); // call the next function in queue
				}
			})
			.catch(function(err) {
				next(err);
			})
	} else {
		next(new Error('No token received to validate user'));
	}
};

// userroutes.js:
var authController = require('./authcontroller');
/* Mention the authentication middleware while doing anything related to user: */
router.use('/:userid', authController.authenticate);
// ... 
router.route('/:userid')
	.get(userController.getUser)
	.put(userController.putUser)
	.delete(userController.deleteUser);
// ...
```

It is advisable to **not** store the *production* JWT Secret Key in the source code but as a production environment variable, say as `process.env.JWT_SECRET_KEY`.
