# MongoDB

MongoDB is a *NoSQL* Database or *Document* Database. NoSQL means that it is **not** a relational DB model. MongoDB uses a *JSON-like syntax* (Javascript object notation) and the data is just dumped into the database and every piece of data is known as a '*document*', it does not have any schemas or vaildations before insertion.

MongoDB (and other NoSQL Databases) are really *easy to scale* since they are not relational and data can be dumped without any pre-structuring, relationship management, etc. They are also *generally faster* with their operations.

Starting the DB server: Run `mongod` in the terminal. Once the DB starts, we can perform operations using the mongo shell, run `mongo` in another terminal window.

**1. Inside the mongo shell, we can run some basic commands**:

- `show dbs`: Lists all the databases that were created.
- `use <db-name>` : Switches to/Creates the specified database.
- `db`: Tells us the current database we are on.
- `db.db.dropDatabase()`: Removes the current database, deleting the associated data files.

**JSON syntax**

MongoDB uses JSON-like syntax.
- It is similar to a JS object literal, starts with `{}`.
- It has key value pairs (`{ key: value }`).
- The values can be any of the JS types (Number, Boolean, String, etc).
- The values can also be Objects or Arrays (`{ key: [val1, val2, ...] }`).
- The values can be objects and they can be nested (`{ key1: { key2: val } }`).
- Arrays can contains objects too (mixed values) (`{ key: [{ key2: val2}, {key3: val3 }] }`).

```javascript=
// Example of JSON-like syntax:
{
	firstName: 'Pushkar',
	lastName: 'DK',
	age: 24,
	address: {
		firstLine: '...',
		secondLine: '...',
		thirdLine: '...'
	},
	contactNumbers: [ 56768655, 4235364 ],
	friends: [
		{ name: 'Joel', age: '24' },
		{ name: 'Pavan', age: '25' }
	]
}
```

[MongoDB Docs](https://docs.mongodb.com/)
[Getting Started with MongoDB Link](https://docs.mongodb.com/manual/tutorial/getting-started/)

**2. Creating a user for a particular database**

When we are inside a database, we can create a user for that database specifically via the `db.createUser()` method. We have to pass an object with the following properties and give permissions.

```javascript=
db.createUser({
	user: 'pushkar',
	pwd: '1234',
	roles: [ 'readWrite', 'dbAdmin' ]
})
```

There can be many more params, but these are the most minimal (our user can read/write to the db and is an admin to it).

**3. Creating a collection inside a MongoDB Database**

Use the `db.createCollection('<db-name>')` method. This creates a collection inside the current database. Note that collections are similar to tables in a relational database. 

**4. Viewing all collections inside a MongoDB Database**

`show collections` will list all the collections inside the current database.

**5. Inserting a document inside a collection**

A *document* in a collection is similar to a row inside a table of a relational database. The document is the one that can be inserted as a JSON-like object.

`db.<collection-name>.insert(<json-like-object>)`: Inserts the object as a document into the collection.

```javascript=
db.sample.insert({ 
	name: 'Pushkar', 
	age: 24, 
	nicknames: [ 'a', 'b', 'c'] 
})
```

To add multiple documents at once, supply an `Array` to the `insert()` method.

```javascript=
db.sample.insert([
	{ 
		name: 'Pushkar', 
		age: 24, 
		nicknames: [ 'a', 'b', 'c'] 
	},
	{
		name: 'Saurabh',
		age: 27,
		gender: 'male',
		skills: ['html', 'css', 'js']
	}
])
```

Every document can be any object - it can have more or less number of properties than other documents and also the same property can be of a different type. MongoDB *does not care*!. This is because there is not schema that enforces certain types for properties and it certainly does not fix the number of properties an object can have.

**6. Viewing the documents inside a collection**

- (a) `db.<collection>.find(<matching-props-obj>)`: Returns *all* the matching documents inside the specified collection in the db.

```javascript=
db.sample.find()

// Output:
/*
{ "_id" : ObjectId("59e37074cbfe1b6614540b53"), "name" : "Pushkar", "age" : 24, "nicknames" : [ "a", "b", "c" ] }
{ "_id" : ObjectId("59e372abcbfe1b6614540b54"), "name" : "Pushkar", "age" : 24, "nicknames" : [ "a", "b", "c" ] }
{ "_id" : ObjectId("59e372abcbfe1b6614540b55"), "name" : "Saurabh", "age" : 27, "gender" : "male", "skills" : [ "html", "css", "js" ] }
*/
```

- (b) `db.<collection>.find().pretty()`: The `pretty()` method takes whatever document or set of documents were returned and *prettifies* the output.

```javascript=
db.sample.find().pretty()

// Output:
/*
{
	"_id" : ObjectId("59e37074cbfe1b6614540b53"),
	"name" : "Pushkar",
	"age" : 24,
	"nicknames" : [
		"a",
		"b",
		"c"
	]
}
{
	"_id" : ObjectId("59e372abcbfe1b6614540b54"),
	"name" : "Pushkar",
	"age" : 24,
	"nicknames" : [
		"a",
		"b",
		"c"
	]
}
{
	"_id" : ObjectId("59e372abcbfe1b6614540b55"),
	"name" : "Saurabh",
	"age" : 27,
	"gender" : "male",
	"skills" : [
		"html",
		"css",
		"js"
	]
}
*/
```

**Note:** MongoDB automatically adds a *unique* `_id` property to every document. This proerty is *indexed* so we can use it to fetch results faster. It also helps mongo keep track of the documents.

- (c) Using the `$or` operator to match two or more values for a particular field: We pass an array to the `$or` property we set on the parameter object.

```javascript=
db.sample.find(
	{
		$or: [
			{name: 'Joel'},
			{name: 'Saurabh'}
		]
	}
)

// Output:
/*
{ "_id" : ObjectId("59e372abcbfe1b6614540b55"), "name" : "Saurabh", "talent" : [ "html", "css", "js" ] }
{ "_id" : ObjectId("59e37cf3cbfe1b6614540b56"), "name" : "Joel", "age" : 26, "gender" : "M" }
*/
```

- (d) Less than and greater than operators with `$lt` and `$gt`: We can specify an object on the property with `$gt` with a value to fetch something greater than that (similarly for `$lt`).

```javascript=
db.sample.find(
	{
		age: { $gt: 25 }
	}
)

// Output:
/*
{ "_id" : ObjectId("59e37cf3cbfe1b6614540b56"), "name" : "Joel", "age" : 26, "gender" : "M" }
*/
```

- (e) There exist operators similar to `$gt` and `$lt`. These operators are the 'Greater than or equal to' (`$gte`) and 'Less than or equal to' (`$lte`).

- (f) Matching when fields have **nested objects** and you want to match on them: You can use the *object notation* as shown in the example below but the property must be *wrapped in quotes*.

```javascript=
/*
{ "_id" : ObjectId("59e38096cbfe1b6614540b57"), "nest1" : { "nest2" : "value" } }
{ "_id" : ObjectId("59e38096cbfe1b6614540b58"), "nest1" : { "nest2" : "value" } }
*/

db.sample.find(
	{
		'nest1.nest2': 'value'
	}
)
```

- (g) Matching **array elements**. We can pass in any value contained in the array to the field in the find object. If that value is there in the mentioned array property, it is considered a match and the document is returned.

```javascript=
/*
{ "_id" : ObjectId("59e372abcbfe1b6614540b55"), "name" : "Saurabh", "talent" : [ "html", "css", "js" ] }
*/

db.sample.find(
	{ 
		talent: 'html' 
	}
)
```

**7. Sorting the results**

Any set of documents returned, like in a `find()` execution, can be sorted before display. We chain the `sort()` method to a method that returns documents (Ex: `find()`) and pass in an object that contains, as property, the field on which the sorting will happen. If the field is given a value `1` then it is ascending sort and if it is given `-1` it is descending sort.

```javascript=
db.sample.find().sort({name: 1}) // ascending

db.sample.find().sort({name: -1}) // descending
```

**8. Counting the documents inside a collection**

Similar to `sort()` method, we can chain a `count()` to an operation returning a set of documents to count them. The output is a numeric value representing the number of documents returned by the query.

```javascript=
// Getting the count of all documents in a collection:
// db.sample.find() will match all the documents inside the sample collection:
db.sample.find().count() // Ex. output: 5
```
**9. Limiting the number of documents returned by query**

We can use the `limit()` method by chaining it to an operation that returns documents (Ex: `find()`). It takes in a number which specifies how many matches to return. If `5` is the limit then only the first 5 (max) matched documents are returned.

```javascript=
db.sample.find().limit(2)
```

**Note:** We can combine `limit` and `sort`:

```javascript=
db.sample.find().limit(10).sort({ name: -1 }); // limit to 10 docs and descending sort on 'name' field.
```

**10. Iterating through matched documents with `forEach()`**

The `forEach()` method takes a callback that gets a parameter which is an object that is one of the documents that matched. Inside this callback we can do something with the doc.

```javascript=
db.sample.find().forEach(function(doc) {
	// mongo has a print() method to print to console.
	print('Name: ' + doc.name);
})

// Output:
/*
Name: Pushkar DK
Name: Saurabh
Name: Joel
*/
```

**11. Updating the documents inside a collection**

- (a) `db.<collection>.update(<match-params-obj>, <update-obj>)`:  This `update()` function updates a document by taking in two parameters. The first is an object with parameters to match the values and second is the new object that updates the old object. Notice that is more like find-and-replace.

```javascript=
db.sample.update(
	{ name: 'Pushkar DK' }
	, 
	{ name: 'Pushkar Desai', 
	  age: 24, 
	  nicknames: ['a', 'b', 'd'], 
	  gender: 'male'
	}
)
```

The replacement object (second parameter) *replaces* the old document instead of updating it!

- (b) Using `$set` to properly update instead of update with replace.

```javascript=
db.sample.update(
	{ name: 'Saurabh' }
	, 
	{ 
		$set: { age: 30 }
	}
)
```

Above example illustrates how the 'age' property can be updated. It does not replace the whole docuement.

- (c) Incrementing a numeric value with `$inc`.

```javascript=
// Previously: age = 30
db.sample.update(
	{ name: 'Saurabh' }
	, 
	{ 
		$inc: { age: 2 }
	}
)
// age = 32
```

We specify the number by which to increment the numeric value by.

- (d) Removing (unsetting) fields from a document with `$unset`:

```javascript=
db.sample.update(
	{ name: 'Saurabh' }
	, 
	{ 
		$unset: { age: 1 } // we need to pass some value to the property we want to unset
	}
)
// age is no longer there on the document containg name `Saurabh`.
```

- (e) `upsert`: The `update` method has an optional third parameter (which is an object). Passing `true` to the `upsert` property of that third parameter object, will check if the `update()` could match an object and if yes, it will update (or replace) that object. If no object matched, it will create a new object with the properties listed in the second (update) parameter. It will also have an object id (`_id`).

```javascript=
// if no document with name 'joel' exists, it gets created 
// with name, age and gender that is specified:
db.sample.update(
	{ 
		name: 'Joel'
	}
	, 
	{ 
		name: 'Joel', 
		age: 25, 
		gender: 'M' 
	}
	, 
	{ 
		upsert: true 
	}
)
```

- (f) Renaming fields with `$rename`: Similar to the `$unset`, `$inc`, and `$set` syntax except that the value specified for the property is going to be its new name.

```javascript=
db.sample.update(
	{ name: 'Saurabh' }
	, 
	{ 
		$rename: { skills: 'talent' } // 'skills' field (an array) is renamed to 'talent'
	}
)
```

**8. Removing the documents inside a collection**

- (a) `db.<collection-name>.remove(<matching-obj>)`: Removes all the documents that match the properties and values passed inside an object as first parameter (like in update method).

```javascript=
db.sample.remove(
	{ name: 'Pushkar Desai' }
)
// All documents containing 'Pushkar Desai' will no longer be available.
```

- (b) Remove just one matching document (the *first* match) with `justOne` property: We can supply an optional second parameter object to the `remove()` method and setting the `justOne` property on this to `true` will delete only one document if a match if found (It deletes only the first match instead of all the matches).

```javascript=
db.sample.remove(
	{ name: 'Joel' }
	,
	{ justOne: true }
)
```

**To access mongo database from node apps, it is advisable to learn `mongoose` which is an NPM module that we can include in our apps. It is a wrapper around mongo and provides us with Schemas (models) thereby enforcing some rules on the data types, has its own methods (different from mongodb), run-time join of collections, etc.**
