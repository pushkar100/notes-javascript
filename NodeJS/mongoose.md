# Mongoose Tutorial

[Link to official mongoose docs](http://mongoosejs.com/docs/)

MongoDB does not provide any schemas (It is noSQL). It is an **ODM** - *Object Data Model* ("ODM") / *Object Relational Model* ("ORM"). An ODM/ORM represents the website's data as JavaScript objects, which are then mapped to the underlying database. Some ORMs are tied to a specific database, while others provide a database-agnostic backend.

Mongoose, on the other hand, wraps around mongodb and it provides **data modeling**. The mongoose Schema is what is used to define attributes for our documents. We can create schemas that mongo documents must follows, defined methods that run as middleware before or after a database operation, etc.

Basically, mongoose creates an *object reference* based on a *schema model*. All this modeling is done within our code itself!

**How to use mongoose (creating a schema)?**

1. First install the mongoose NPM module (`npm install mongoose`). You might want to install it with `--save` option since you would want it in production.
2. Require the module in your node app with `var mongoose = require('mongoose);` (You can use any variable name of your choice).
3. Set a variable reference to the mongoose schema with `var Schema = mongoose.Schema`.
4. Create the schema with `new Schema(<schema-constructor-object)`.

```javascript=
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: String,
	keywords: Array,
	published: Boolean
});
```

**Creating an instance of the schema**

Once the schema has been created, it is like a **blueprint**. It needs to be used on a real mongodb collection.

We have a method on the mongoose object called `model()`. This method takes in a name of a collection and the schema (blueprint) and applies the schema to the collection. When this method is run, the collection is created in the mongodb server (if not existing) with the *pluralized, lowercase* name supplied to the `model()` method. If mongodb server is running locally, the `mongod` process needs to be running in a terminal - In the CLI, type `$ mongod<hit enter>`).

This "model" can be exported to be used in other files:

```javascript=
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: String,
	keywords: Array, // We will talk more about creating the schema later
	published: Boolean
});

module.exports = mongoose.model('Book', BookSchema); // Internally, collection 'books' is opened in mongodb
```

**Connecting to a mongoDB Database**

Once the schema and the model are tied up together, we have to connect to a mongodb database first. Just like the `model()` method, there exists a `connect()` method on `mongoose` itself. 

The `connect()` method takes in the URL to the database. If running locally the syntax would be `mongodb://localhost/<dbName>` and if it is running on a production DB server, the URL will be provided by them.

```javascript=
// /bookmodel.js:
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: String,
	keywords: Array,
	published: Boolean
});

module.exports = mongoose.model('Book', BookSchema); // Internally, collection 'books' is opened in mongodb
```

```javascript=
// /index.js
var mongoose = require('mongoose');
var bookModel = require('./bookmodel');

var db = 'mongodb://localhost/mongoosetest'; // mongoosetest is our db name
mongoose.connect(db);
```

The connection to the mongodb server ends whenever the node app stops (or crashes) and it is reconnected whenever the connection is made via `mongoose.connect()`.

## Schema types (How to define the schema)

Mongoose uses the general javascript data types such as `Number`, `Boolean`, `String`, `Object`, `Array`, etc (known as Schema Types in mongoose) plus a few extra ones like `mixed` (for mixed types), `Date` and `ObjectId`. 

(There is **no** `undefined` or `null` or `Symbol` or `function`)

[List of Schema Types](http://mongoosejs.com/docs/schematypes.html)

Inside the schema constructor object, there are two ways to define the schema for a field:
1. `prop: <SchemaType`: This just tells the type of the field and no other info is mentioned.
2. `prop: { type: <SchemaType, ... }`: This takes in an object with the type property that defines the field's type. Optionally, we may pass some other properties such as `required`, `unique` and `default`.
	- `required` is a boolean that, if `true`, will make sure that this field is required (a document cannot be saved into mongo db without it). 
	- `unique` is also a boolean which, if `true`, will make sure that the value supplied to this is unique (no other document can have the same value for this field). 
	- `default` which sets the specified value as the default if no value is passed in place of it (Good use case is setting `Date.now()` is date is not sent to the database while saving; Dates are saved in ISO format).

There are other options too.

**Referencing another collection**

Imagine that a 'book' model ('books' collection) has an 'author' field. There exists another model 'author' ('authors' collection) that needs to be referenced inside 'book'. So, for the 'author' field inside book, we specify the type as `mongoose.Schema.ObjectId` or `mongoose.Schema.Types.ObjectId` and pass a property called `ref` which holds the name of the model it is referencing (in this case, it is 'author' model).

```javascript=
// /bookmodel.js:
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: String,
	published: {
		type: Date,
		default: Date.now,
		required: true
	},
	keywords: Array, // keywords is just mentioned as array, does not say anything about its element types
	author: {
		type: Schema.ObjectId, // or Schema.Types.ObjectId (same thing)
		ref: 'author',
		required: true
	}
});

module.exports = mongoose.model('Book', BookSchema); // Internally, collection 'books' is opened in mongodb
```

**How do we differentiate between an object and a schema declaration?**

If properties contain keywords such as `type`, `default`, etc, it is a schema definition, otherwise it is a nested definition.

```javascript=
// ...
var someSchema = new Schema({
	// links is an object but link.url has a schema definition:
	links: {
		url: {
			type: String,
			required: true
		},
		protocol: String
	}
});
// ...
```

This nested object is known as an *Embedded Document* (Because it is a document within the document).

**How do we define schema of array elements (i.e schema for the object inside array)?** 

We can do it like this: `someArr: [{ type: String}]` (Every element inside the 'someArr' needs to be a string).

## Querying the database

Once we have created a model (and, maybe exported it), we can use that model to query the database.

The model will have a method `find()` which can be used to fetch data from the database. There are a couple of ways in which we can use it:
1. `modelName.find(function (err, docs) {})` : Provides a callback. First param of callback is error and second is the array of documents returned from the query. The `find()` method with no parameters will fetch **all the documents**. 
	- `modelName.find(<match-props-obj>, function (err, docs) {})` : Provides a callback after *filtering* the data in the collection.)
- `modelName.find(<match-props-obj>).exec(function (err, docs){})`: Without callback. The callback is supplied to the `exec()` method that was chained onto the `find()` method. This method is useful because other methods like `limit()`, `count()`, `sort()` etc (These functions are similar to the functions in pure mongodb). 

```javascript=
// /index.js:
var mongoose = require('mongoose');
var bookModel = require('./bookmodel');

var db = 'mongodb://localhost/mongoosetest';
mongoose.connect(db);

bookModel.find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec(function(err, books) {
  	res.json(books); // assuming that it had access to the response object.
  	// We can send a json response since data was in json-like syntax
  });
```

**Note:** 
1. The chained methods' syntax is very similar (or identical) to pure mongodb functions that you would use in the mongo shell.
2. We can use **regular expressions** to match fields in the `find()` match object.

**Fetching only one document**

`find()` will always return an `Array` even if it matched only one document in the query. To return just a single document (just the JSON-like object and not an array), we can use `findOne()`. It works just like `find` and can be chained, etc but returns just one document (if there is am match) instead of an array.

```javascript=
// /index.js:
var mongoose = require('mongoose');
var bookModel = require('./bookmodel');

var db = 'mongodb://localhost/mongoosetest';
mongoose.connect(db);

bookModel
	.findOne({ title: /1/ })
    .exec(function(err, books) {
    	console.log(books);
    });
```

## Creating (inserting) a new document

We can insert a new document into a collection. Since the model that was created is linked to a collection with a schema, we can instantiate it with the `new` keyword to create an object compliant with that schema. This object will have a `save()` method that will try to save the object in the database. There is a callback sent to it and it receives an *error* (if any) plus the *saved object*.

```javascript=
// /index.js:
var mongoose = require('mongoose');
var BookModel = require('./bookmodel');

var db = 'mongodb://localhost/mongoosetest';
mongoose.connect(db);

// Creating a book (saving):
var book = new BookModel();

// On this new object, we can store properties acc to schema:
book.title = 'New book';
book.copies = 10;

// Save the book into DB:
book.save(function(err, savedBook) {
	if(err) { 
		console.log('Error');
		// res.status(404).send('Not found');
	} else {
		console.log(savedBook);
	}
});

// output:
/*
{ __v: 0,
  copies: 10,
  title: 'New book',
  _id: 59e3b596701b26693c335dfc,
  published: 2017-10-15T19:23:02.497Z }
 */
```

**Note:** There exists another method `create()` which works the same way as in `save` but it does not require creating a new object from the model. It is called on the model itself and not on the model's object (the object is passed as first arg to create and second is callback). Stick to `save()` as it is little less error prone and is used more often/is popular.

## Updating a document

Mongoose provides us with the `findOneAndUpdate()` method on the model. It is almost identical to the `update` function in *pure mongodb*. It takes the following parameters:
1. The matching query object (which can match fields, use operators like $gt, $lt, etc), use regex, etc.
2. The object to replace our document with. We specify only the fields we want to update (& it can $set/$rename/$unset/$inc/etc like in pure mongodb update function). To not replace but do pure updation of fields, use `$set` operator (same as in mongodb).
3. An optional object with options such as `upsert: true` which will check if an object matches. If there is a match it is updated, otherwise it will create a new one with specified params (Without upsert, if no doc matches, it will throw an error). `upsert = update + insert`
4. The callback function - has two params: first is error object, second is updated object (if no error).

```javascript=
// /index.js:
var mongoose = require('mongoose');
var BookModel = require('./bookmodel');

var db = 'mongodb://localhost/mongoosetest';
mongoose.connect(db);

BookModel.findOneAndUpdate(
	{ title: /New/ },
	{ 
		$inc: { copies: 5 },
		$set: { title: 'New new book' }
	},
	{ upsert: true },
	function(err, books) {
		if(err) console.log(err)
		else {
			console.log(books);
		}
	}
);
```

**Note:** The object returned in the callback of the `findOneAndUpdate()` is the version of the document prior to updation (not after updation). No worries, it is updated in the database.

## Deleting a document

We can use the `findOneAndRemove()` method. It takes two parameters:
1. The matching query object
2. The callback function - first param is error (if any) and second is the removed document.

It is also a method called on the model (and not on an object of the model or anything).

```javascript=
// /index.js:
var mongoose = require('mongoose');
var BookModel = require('./bookmodel');

var db = 'mongodb://localhost/mongoosetest';
mongoose.connect(db);

BookModel.findOneAndRemove(
	{ title: 'New new book' },
	function(err, book) {
		if(err) console.log(err)
		else {
			console.log(book);
		}
	}
);
```

## Mongoose methods & Finding by Id:

Mongoose Methods Methods can also be defined on a mongoose schema. These are like *middleware* functions for database operations. Some methods are on the schema while some are prototypal, run on the object of the model. 

We can run some of them ass either `pre`  (before some operation) or `post` (after some operation).

It is also better to query based on `_id` of the document since every doc has a unique id and they are indexed, so searching using ids will be faster. If you can use `findById()` method then do so.

[Scotch IO tutorial on using mongoose (CRUD operations) and methods](https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications)

## Using Promises in mongoose

[Switching to promises in mongoose (2015)](https://eddywashere.com/blog/switching-out-callbacks-with-promises-in-mongoose/)

[ES6 Promises in mongoose](http://erikaybar.name/using-es6-promises-with-mongoosejs-queries/)

## Using `populate()` to fetch referenced collection documents into current collection

[Official doc for `populate()`](http://mongoosejs.com/docs/populate.html)
