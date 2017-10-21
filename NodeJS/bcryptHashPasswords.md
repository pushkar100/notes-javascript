# Password Hashing & Salting with `brcypt` in MongooseJS

[`bcrypt` NPM module linkz](https://www.npmjs.com/package/bcrypt)

We can use the `bcrypt` NPM module to ***hash*** and ***salt*** passwords before storing them into the database. We must not store passwords in plain text because that is a security risk and it also has legal consequences to the company.

`bcrypt` interactions should be performed asynchronously to avoid blocking the event loop (bcrypt also exposes a synchronous API)

**Steps** involved:

- Install bcrypt: **`npm install bcrypt —save`**


- The password must always be ***encrypted*** *before* saving it into the database. We require:

  - A salt
  - The plain text password
  - A callback function

  The purpose of the [salt](http://en.wikipedia.org/wiki/Salt_cryptography) is to defeat [rainbow table attacks](http://en.wikipedia.org/wiki/Rainbow_table) and to resist brute-force attacks in the event that someone has gained access to your database.

  The syntax for encrypting a password is: **`bcrypt.hash(password, salt, function(err, hash) {})`**

  The syntax for generating a salt is: **`bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {})`**. The `SALT_WORK_FACTOR` is a number representing the iterations to perform to generate a salt (default is `10`).

- Mongoose has ***middleware functions*** that we can define before or after an operation. That is, there are **`pre`** and **`post`** middleware functions that perform actions before and after an operation, respectively. These function are defined on the schema itself (eg. `UserSchema.pre('save', function(next) {})`). The callback function receives a reference to the `next` method. Since the callback is a middleware, it needs to call the next method once it is done processing. Inside the middleware, the object of the schema can be accessed via **`this`**.

- Calling`next` with an error parameter will be handled by an error middleware.

- **Note**: 

  - Mongoose middleware is **not** invoked on `update()` operations, so you must use a `save()` if you want to update user passwords.
  - Because passwords are not hashed until the document is saved, be careful if you're interacting with documents that were not retrieved from the database, as any passwords will still be in cleartext.

```javascript
// Encrypting a password before saving it:

// usermodel.js:
// ...
const SALT_WORK_FACTOR = 12; // 10 is default
// ...
/* Salt and hash passwords before saving: */
UserSchema.pre('save', function(next) {
	var user = this;

	// Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// Override the cleartext password with the hashed one
            user.password = hash;
            next();
		});
	});
});
// ...
module.exports = mongoose.model('user', UserSchema);
```

- Mongoose also provides a prototype object called `methods` to define functions which can be called on the schema's object. We can define a prototypal method on the user schema so that we can compare passwords of a user saved in the database to the details he is providing while signing in.
- The `compare` method of `bcrypt` has this syntax: **`bcrypt.compare(plainPass, HashedPass, function(err, match) {})`**. `match` is true if password matched with that which is hashed in the DB.

```javascript
// usermodel.js:
// ... 
/* Compare passwords: */
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatched) {
	    if(err) return cb(err);
	    cb(null, isMatched);
	});
};
// ...
module.exports = mongoose.model('user', UserSchema);
```

- Sample usage of comparing passwords:

```javascript
// authcontroller.js:
// ...
exports.userSignIn = function userSignIn(req, res, next) {
	var email = req.body.email,
		password = req.body.password;

	// if no username or password then send a message:
    if (!email || !password) {
      next(new Error('You need an email and password'));
    } else {
    	UserModel.findOne({ email: email }) // email must be unique acc. to user schema
    		.then(function(user) {
    			/* Check if user's password matches first: */
    			user.comparePassword(password, function(err, isMatched) {
    				if(err) return next(err);

    				if(isMatched) {
    					var userIdEmail = {
		    					_id: user._id,
		    					email: user.email
			    			};

			    		var token = jwt.sign(userIdEmail, config.jwt.secretKey, { 
			    				expiresIn: config.jwt.expiresIn
			    			});

			    		res.json({
			    			success: true,
			    			token: token
			    		});
    				} else {
    					res.json({
			    			success: false,
			    			message: 'Unauthorized access'
			    		});
    				}
    			});
    		})
    		.catch(function(err) {
    			next(err);
    		});
    }
};

// authrouter.js:
// ...
var authController = require('../controller/authcontroller');
/* Handle auth routes */
router.route('/signin')
	.post(authController.userSignIn);
```

[Link to tutorial article](http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt)

[Youtube Video Explanation](https://www.youtube.com/watch?v=lWDws1j8fo4)

[How bcrypt hashing and salting works](https://www.youtube.com/watch?v=O6cmuiTBZVs)

[JWT vs OAuth](https://stackoverflow.com/questions/39909419/jwt-vs-oauth-authentication)

