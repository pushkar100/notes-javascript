# PWAs Tutorial (Includes PRPL Pattern)

[Source: Udemy](https://www.udemy.com/progressive-web-apps/)

Native app downloads: 65% of users do not install any app in a month. This is because they are not introduced to them unless they explicitly search for those apps

Mobile websites: They are easily accessible but you need a good internet connection and pay for data charges

**Progressive Web Apps**: Bridges the gap between mobile and native apps by having an app like experience which works in both online and offline mode (and integrates modern technology wherever possible to provide the user with a rich experience)

PWAs make it easy to convert existing websites by adding functionality to them incrementally without having to re-develop our existing website (*Progressive enhancement*)

**Turning a website into a PWA**:

1. We add a couple of *layers* like **Service workers**: Standalone script that runs independently of the rest of the website. It is like a client-side proxy (in-between/in-the-middle) object.
   1. *Cache content*: Service workers cache content and for that it uses the new `caches` API (client-side storage for any resource on the page)
2. **Responsive**: That it needs to support mobile devices (ex: mobile-first design). The design needs to match the native apps
3.   for Performance**: Run smoothly on any device - again, much like a native app experience
4. **Best Offline Experience**: Work offline, at least to some degree (or failing gracefully)

Even if these layers and APIs are not detected, the website continues to function normally. Therefore, it is truly "progressive" enhancement

**App Shell**: 

We abstract away as much content away from the app's layout and user interface as possible so that all those static assets can be cached. We only ever have to load the dynamic content from the internet

**Manifest**:

It is simply a file that specifies the launch icon, splash screen, name, start url, etc. It helps turn a simple webpage into its own entity on the user's device (i.e A home screen app)

Basically, a PWA needs to have at least the following 3 things to be useful:

1. *Service worker*
2. *Cache*
3. *Manifest*

## Service worker

It is a proxy object that sits between our web app and the network.

It runs ***independently*** of our web app and therefore, 

1. capable of receiving ***push notifications***, and 
2. ***syncing in the background***, even when the app is closed!

**Main role of service workers in PWAs**:

1. Intercept requests and respond to them appropriately based on whether the network is available or not, or 
2. whether the request is available from the cache

**Requirements of a service worker**:

1. Requires a secure connection work. Therefore, **HTTPS** must be enabled (Service worker constantly modifies network requests so it must do it on a secure connection - cannot have data in the open where it is vulnerable to man-in-the-middle attacks). The only exception to this is `localhost`. You may use HTTP in **`localhost`** for development purposes
2. Standards used in service workers:
   - They use **promises** instead of traditional callbacks (mandatory)
   - They prefer the **fetch** method to request additional resources instead of the outdated XMLHttpRequest (mandatory)

**Q: How do we know promises and fetch are supported by the browser?**
A: If the browser supports service workers, it automatically supports promises and fetch. So, we only need to check if service workers are enabled in the browser being used.

**The `fetch` method**

This method is called with the URL/API endpoint. It returns a **promise** on which we can call the then & catch methods which receive the response or the error message, respectively.

The response object's `body` is a **readable stream** (A consumable - they can only be read once!). We have many methods defined on response object that make it easy for us to work with readable streams. Ex: `response.json()` will fetch the response body as `json`. These methods again return ***promises***.

Calling `response.json()` twice will not return the json response in the second response since the responses are readable stream which can only be consumed once!

In order to consume it multiple times, we need to create `.clone()` on the response object

```javascript
fetch('https://api.github.com/users/goharbor/repos')
    .then(response => {
        let clone = response.clone();
        response.json().then(results => {
            console.log(results);
        });
		// Note: do not consume & the clone!
    	// Always clone & then consume once, & second time on cloned object
        clone.json().then(results => {
            console.log(results);
        });
	})
    .catch(e => { // In case fetch fails
    	console.log(e);
	})
/* 404 response is not an error - will not go to catch
only if conncection to mentioned server cannot be made - we go to catch
*/
```

To check for `404` error, you can use **`response.ok`** property which returns a boolean value:

```javascript
fetch('https://api.github.com/users/goharbor/repossfsf')
    .then(response => {
        if(response.ok) {
            response.json().then(results => {
                console.log(results);
            });
        } else {
            console.log('Not found');
        }
        
    })
    .catch(e => { // In case fetch fails
    	console.log('Error: ', e);
	})

/* Output:
Not found 
*/
```

**Popular response methods:**

1. `response.text()`: Gets the response body in plain text
2. `response.ok`: `true` if resource was found else `false` (404)
3. `response.json()`: Gets the response body in json format

```javascript
// Chaining the fetch methods: (BETTER!)
fetch('https://api.github.com/users/goharbor/repos')
    .then(response => {
        if(response.ok) {
            return response.json(); // returns a promise & current then waits for it
        } else {
            throw 'Not found';
        }
    })
	.then(results => {
	    console.log('Chained then');
    	console.log(results);
	})
    .catch(e => { // In case fetch fails
    	console.log('Error: ', e);
	});
```

### Service Worker Lifecycle

1. ***Registering a service worker***: The browser reads the service worker script (say, `sw.js`) and parses it like any other javascript file
2. ***Installing a service worker***: Perform important *setup* tasks, like setting up the cache
3. ***Waiting for events after being installed***: Service workers may need to wait for events after being installed
4. ***Activated phase***: Service workers has full control over the page

### Building a Service Worker

Service worker is part of the `navigator` web API.

1. Feature detection - check if service worker support is available in the browser `navigator.serviceWorker`
2. Register the service worker. `navigator.serviceWorker.register(<path-to-sw>)`. This step returns a *promise* that provides to the resolved's callback a registration object as parameter

If the promise resolved, it means that service worker was found, had no syntax errors, and was registered successfully

```javascript
/* main.js */
// 1. Progressive Enhancement (is SW supported)
if (navigator.serviceWorker) {
  // 2. Register the SW
  navigator.serviceWorker.register('/sw.js').then(function(registration){
    console.log('SW Registered');
  }).catch(console.log); // === catch(e => console.log(e));
}
```

```javascript
/* sw.js */
// Service Worker
console.log('From SW: Registered');
```

```javascript
/* Output:
From SW: Registered
SW Registered
*/

// First the SW logs, then main logs
```

- Service worker is a separate entity with *no access* to the page context like window objects, etc. 

- When working with a service worker, we use the **`self`** keyword inside a service worker to refer to itself.
-  Every service worker that is registered is assigned a **unique key** (Ex: #545, #550, etc)
- We can safely assume that basic ES6 is supported inside service workers

3. Attaching *event listeners* to service workers: We want to target certain events like `install`, `activate`, etc

```javascript
/* sw.js */
self.addEventListener('install', e => {
	console.log('SW: install event');
    // Used for some async setup tasks - like creating a cache for the page
});

self.addEventListener('activate', e => {
  console.log('SW: activate event');
});

/* Output:
SW: install event
SW: activate event
*/
```

When a service worker is installing (say, setting up cache) we do not want it to be activated. So, `install` event callback param gives us a **`waitUntil(<promise>)`** method that waits until the promise gets resolved before moving on to the next part of the lifecycle, like activate

```javascript
/* sw.js */
self.addEventListener('install', e => {
	let aProm = new Promise(resolve => {
		setTimeout(resolve, 5000);
	});

	e.waitUntil(aProm);
});

self.addEventListener('activate', e => {
  console.log('SW: activate event');
});

/* Output:
*** WAITS FOR 5 SECONDS ***
SW: activate event
*/
```

The `activate` event is ideal for performing tasks on take over from another service worker like *cache cleanup*, etc. We can do a `waitUntil` inside this event listener too (like we did above in `install`)

```javascript
/* sw.js */
self.addEventListener('install', e => {
	let aProm = new Promise(resolve => {
		setTimeout(resolve, 5000);
	});

	e.waitUntil(aProm);
  // self.skipWaiting();
});

self.addEventListener('activate', e => {
  	let bProm = new Promise(resolve => {
		setTimeout(resolve, 5000);
	});
	console.log('SW: activate event');
	e.waitUntil(bProm);
});

/* Output:
*** WAITS FOR 5 SECONDS ***
SW: activate event
*** WAITS FOR 5 SECONDS ***
*/
```

**Note**: If we do not unregister service worker and try to register a new one over it (Ex: same name, same path), it will get installed but will not get activated. This ensures that one service worker does not get abruptly replaced by another service worker, causing chaos on the client side

As an example, if we register `sw.js` and then modify it and reload the page, without having removed the currently registed service worker, then this is what happens:

- Original `sw.js` with unique id (#256) is *installed* & *activated* (Exists before + after reload)
- New `sw.js` gets next unique id (#257) and is *installed* but **not activated** (It has not taken over the existing service worker yet)! (Exists only after reload)

**Q: How does the new service worker take over then?**
A: The user has to close the current session (tab) completely and reload the page into a new session (tab)

**Q: How to force a new service worker to take over from a previous one?**
A: By using the **`self.skipWaiting()`** method. This can be simulated in the DevTools (Application > Service Workers > You will see the option next to the new service worker) OR by using `self.skipWaiting()` inside the event listeners of `install` event (of the new service worker). It *stops the old service worker* and *activates the new one*.

```javascript
/* sw.js */
self.addEventListener('install', e => {
  	self.skipWaiting();
});

self.addEventListener('activate', e => {
	console.log('Very Newly registered SW');
});

/* Output:
Very Newly registered SW
*/
```

Force it only when we are 100% sure that it is OK for the new worker to take over immediately!

**Note**: *Alternate way to force update of SW* - Turn on `update on reload` feature under `service workers` in `application` tab of chrome devtools

### Service worker events (`fetch`)

The **`fetch`** event is very much like the other ones - `install`, `activate`, etc. However, it listens for *network requests*, either local or remote.

The callback param has **`e.request`** property from which you get different data related to the request, like `url`.

Since service workers are like a *proxy* between the client app and the server, the network requests are accessible by the service worker

```javascript
self.addEventListener('fetch', e => {
	console.log('fetch event: ', e.request.url);
});

/* Output: 
fetch event:  http://localhost:8080/
fetch event:  http://localhost:8080/style.css
fetch event:  http://localhost:8080/thumb.png
fetch event:  http://localhost:8080/main.js
SW registered (from main.js)
*/
```

**Q: How can SW log main.js when main.js is responsible for registering the SW?**
A: This is possible because once the service worker is registered, it runs in the background. So, anytime the site is loaded, say reloaded (etc), the service worker is already present and the `fetch` event will log all the network requests starting from the page itself up to the scripts & styles, etc.

**Q: What else does the `fetch` event get fired for?**
A: It is triggered on any *navigation*. That is, route change (URL change)

**Manipulating the request**

Service workers are proxies, so we can identify the requests being made from the `e.request.url` and target certain type of files like your stylesheets. 

The identification can be done using a simple regular expression or the `String.prototype.endsWith()` available to us since ES6

```javascript
self.addEventListener('fetch', e => {
	if(e.request.url.endsWith('style.css')) {
		console.log('Fetch event for style.css: ', e.request.url);
	}
});

/* Output:
Fetch event for style.css:  http://localhost:8080/style.css
*/
```

We can use **`e.respondWith(<promise>)`** to respond with our own file in an intercepted request. The method expects a promise and `fetch` also returns a promise. Hence, we can combine them

**Note**: The user will still see the originally requested file in the sources. The user/browser is totally unaware of the service worker proxy. So, even if we intercept the request and send some info, the user will think that the info is coming from the original source

```javascript
self.addEventListener('fetch', e => {
	if(e.request.url.endsWith('style.css')) {
		e.respondWith( fetch('style2.css') );
	}
});
```

**Custom Response objects**

We can intercept any route by matching a regex on `e.request.url` in a `fetch` event listener. And, after doing so, send our own custom response.

This response is the same response object we get when using the `fetch()` javascript API. We initialize it with the **`Response`** constructor function. We pass the response object in the `e.respondWidth()` method - essentially, this method is looking for a a promise that resolves to a response object! (& `fetch` does exactly that)

```javascript
self.addEventListener('fetch', e => {
	if(e.request.url.endsWith('/greet')) { // Intercepts the `/greet` request
		let customRes = new Response('Hi, I\'m a custom response');
		e.respondWith( customRes );
	}
}); // Response sent as "text/plain"
```

**Changing response headers**

The second argument to the `Response` *constructor* is an object `{}` that holds the data for various options like status, url, type, etc. We can add the **`headers`** key to it specify the headers.

The headers can be defined by another *constructor* called **`Headers` ** that takes in an object with key, value pairs corresponding to the header names and their values

```javascript
self.addEventListener('fetch', e => {
	if(e.request.url.endsWith('/greet')) {
		let headers = new Headers({ 'Content-Type': 'text/html' });
		let customRes = new Response('<h1>Hi, I\'m a custom response</h1>', { headers }); 
        // Second argument is the same as { headers: headers }
		e.respondWith( customRes );
	}
});
```

**Note**: 

1. The `fetch()` API can take in a `e.request` as its argument!
2. Even the network requests made by the Javascript of the page can be intercepted by the `fetch` event of our service workers

**Q: How does manipulating requests help our PWA?**
A: If a request depends on network connection then we can serve our own content to replace it when it is not available or network is down, etc.

```html
/* index.html */
<script>
    const imageDiv = document.querySelector('#img');
    fetch('/camera_feed.html') // assume this page has been deleted
        .then(res => res.text())
        .then(imgTag => {
        imageDiv.innerHTML = imgTag;
    });
</script>
```

```html
<!-- camera_feed.html : Assume it has been deleted -->
<img src="https://placem.at/people?w=500"> 
```

```javascript
/* sw.js */
self.addEventListener('fetch', e => {
	if(e.request.url.endsWith('/camera_feed.html')) {
		e.respondWith( // expects a response object
			fetch(e.request)
				.then(res => {
					if(res.ok)
						return res;
					else
						return new Response('<h3>Camera feed not currently available</h3>');
				})
		);
	}
});
```

The network tab in chrome will show two rows for `camera_feed.html`. First, it shows that it has been assigned to the service worker & second is the actual resource request from within the service worker.

### Scope of a Service Worker

The scope defines the reach of the service worker inside the web app. By default, the scope of a service worker *starts from its relative path and goes downwards*

For example, if service worker is registered in the `/` root folder, it is registered on all the routes since root is the highest route.

```javascript
/* main.js */
// ...
navigator.serviceWorker.register('/sw.js')
// ....

/* Gets registered on the following routes:
"/", "/posts", "/users", "/posts/1", "/posts/1/links" etc ....
*/
```

It does *not* get registered on routes that are above its relative path:

```javascript
/* main.js */
// ...
navigator.serviceWorker.register('/posts/sw.js')
// ....

/* Gets registered on the following routes:
"/posts/", "/posts/1", "/posts/1/links" etc ....
*/

/* Does not get registered on:
"/", "/users/", "/posts" IMPORTANT! - IF TRAILING SLASH IS MISSING, IT DOES NOT REGISTER
*/
```

**Note** that we cannot intercept requests (ex: `fetch` event) when the service worker does not get registered

**Q: How do we match folder when trailing slash is missing?**
A: We can pass a second argument to `navigator.serviceWorker.register()` method. This is an object that has the `scope` property which takes in the path from which that service worker must operate. Here, we can omit the trailing slashes

```javascript
/* main.js */
// ...
navigator.serviceWorker.register('/sw.js', { scope: '/posts' })
// ....

/* Gets registered on the following routes:
"/posts/", "/posts" (without trailing '/'), "/posts/1", "/posts/1/links" etc ....
*/

/* Does not get registered on:
"/", "/users/", etc
*/
```

**Q: Why scopes?** 
A: Coz... uhmm...Security!

Service workers are ***unique to their scopes***. Two service workers loaded on different scopes do not overlap where one tries to activate on top of another. Instead, they are registered as two different service workers

```JavaScript
/* Assumption: 
An SW scoped to '/posts', and 
another SW scoped to '/posts/' 
*/

/* Accessing '/posts': 
Registers a service worker for '/posts' */

/* Accessing '/posts/': 
Registers another service worker for '/posts/' (different scope) */

/* We have two service workers registered - but each unique to their own scope! They do not override one another - they get registered when they are 'in-scope' and are considered to be separate workers when both of them are 'in-scope' */ 
```

### `ServiceWorkerRegistration` object

It is the object that is available in the `then` callback of the resolved `register()` promise. It is used to ***monitor*** the service workers as they go through their various stages and updates

```javascript
/* main.js */
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js')
  	.then(registration => {
    	console.log('ServiceWorkerRegistration Object', registration);
  	}).catch(console.log);
}
```

The object provides references to:

1. Currently active service worker (**`active`** property)
2. The worker being installed (**`installing`** property). `null` if no worker is being installed
3. The waiting worker (**`waiting`** property) if a new worker is waiting to take over from the existing (old) worker. `null` if no worker is waiting
4. The **`scope`** of the worker being registered
5. A few other methods: `pushManager`, `sync`, `onUpdateFound`, etc.

**`onUpdateFound`**

An event handler that gets called when a ***new*** service worker is found! We must assign it a function

```javascript
/* main.js: */
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js')
  	.then(registration => {
    	registration.onupdatefound = () => {
            // Following will log if service worker is updated:
    		console.log('New SW found');
            console.log(registration.installing); // an installing SW object gets logged
    	}
  	}).catch(console.log);
}
```

**`registration.installing`**

It contains the reference to a new (say, edited) service worker that is being installed. On this new service worker, we can listen to the state change with **`onstatechange`**. Whenever the new worker's state changes (ex: from installing to activate), the method defined gets triggered. The **`state`** property of the service worker will give access to its current state.

```javascript
/* main.js */
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js')
  	.then(registration => {
    	registration.onupdatefound = () => {
    		console.log('New SW found');
    		let newSW = registration.installing;

    		newSW.onstatechange = () => {
    			console.log(newSW.state);
    		}
    	}
  	}).catch(console.log);
}
```

```javascript
/* sw.js */
self.addEventListener('install', e => {
	e.waitUntil(new Promise(resolve => {
		setTimeout(resolve, 4000);
	}));
	self.skipWaiting();
}); 
 
self.addEventListener('activate', e => {
	console.log('SW Activated');
});
```

```javascript
/* Output:
(main.js:5) New SW found
(main.js:9) installed
(main.js:9) activating
(sw.js:9) SW Activated
(main.js:9) activated
*/
```

### Message passing between main context and the service worker

Using the `ServiceWorkerRegistration` object, we can identify an active, installed, or a waiting service worker from the main context. After that, we can pass messages to them

The messaging API (part of HTML5) is used for this purpose. Every service worker has the **`.postMessage()`** method in the main context to post a message to itself (the service worker)

In order to receive a message from the main context, add an event listener in the service worker by the name **`message`**. The event object available on the callback has the **`data`** property that we can use to access the message that was passed to the service worker

```javascript
/* main.js */
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(function(registration){
  	if(registration.active) {
		registration.active.postMessage('Hello from main.js');
  	}
  }).catch(console.log);
}
```

```javascript
/* sw.js */
// If active service worker:
self.addEventListener('message', e => {
	console.log(e.data); // Hello from main.js
});
```

**Q: Why do we need to pass messages?**
A: It has many use cases. For example, when we have a new service worker update, we can confirm with the user whether we want to activate this new service worker or not

```javascript
/* main.js */
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(function(registration){
  	registration.onupdatefound = () => {
  		let newSW = registration.installing;
  		if(confirm('New SW found! Do you want to update it?')) {
  			newSW.postMessage('update_self');
  		}
  	}
  }).catch(console.log);
}
```

```javascript
/* sw.js: */
self.addEventListener('message', e => {
	if(e.data === 'update_self') {
		console.log('Updating: SW'); // Updating: SW
		self.skipWaiting();
	}
});
```

**Messaging the client from the service worker (reverse)**

A client is a *window* (or a *tab*) of the app in the same browser. It is not a user!

For example, if an app is opened in chrome, its service worker gets registered for that tab (client 1). Now, if another tab in the same chrome opens the same app, it is considered another client of the already registered service worker in chrome (client 2)

If we now open the app in firefox, a new service worker gets registered for its own tab, separate from chrome, (client 1 of firefox). And similar to chrome, if a new tab in firefox opens the same app for which a service worker was registered, that tab becomes the next client for that app's service worker in firefox (client 2) - again, separate from chrome.

*This is how we can think of multiple clients of a service worker*: Multiple tabs/windows of the same app in a particular browser (first tab to open the app will be responsible for registering the SW)

**`self.clients`**: An object containing a reference to all the clients of the service worker

**`self.clients.matchAll()`**: Matches all the clients of that service worker. Returns a *promise* which when resolved will pass the ***array of clients*** as param to the `then` callback. We need to respond to each service worker indivdually, so loop them with a `for` loop or a `forEach()` callback. To each of them, we can use the same `postMessage()` method to pass back a message to the respective main contexts.

Similar to receiving a message inside a service worker, we receive the message in the main context with `message` event's listener attached using the `addEventListener` callback

```javascript
/* main.js: */
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(function(registration){
	if(registration.active)
		registration.active.postMessage('Respond to this');
  }).catch(console.log);

  navigator.serviceWorker.addEventListener('message', e => {
  	console.log(e.data); // Hello from service worker
  });
}
```

```javascript
/* sw.js: */
self.addEventListener('message', e => {
	self.clients.matchAll()
		.then(clients => {
			clients.forEach(client => {
				client.postMessage("Hello from service worker");
			});
		});
});
// THIS IS MORE LIKE A BROADCAST MESSAGE TO ALL CLIENTS!
// Triggered whenever a new tab opens: service worker becomes active on that tab
// This triggers the message & response between clients (all) & service worker
```

**Sending a private message to a particular client**

Each client (a `windowClient`) has a unique `id` which we can refer to and send a message. But, this still doesn't tell us the `id` of the client that sent us the message.

In order to find the `id` of the client that sent us a message to which the SW can respond to, refer to the **`e.source`** property which refers to the client (`windowClient`) that sent the message. It has the `id` property

```javascript
/* main.js */
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(function(registration){
	if(registration.active)
		registration.active.postMessage('Respond to this');
  }).catch(console.log);

  navigator.serviceWorker.addEventListener('message', e => {
  	console.log(e.data); // Hello from service worker
  });
}
```

```javascript
/* sw.js: */
self.addEventListener('message', e => {
	let clientId = e.source.id; // Identifies client that sent message
	self.clients.matchAll()
		.then(clients => {
			clients.forEach(client => {
				if(clientId === client.id) // respond only to client that sent message
					client.postMessage("Hello from service worker");
			});
		});
});
// Other clients will not log the message passed back from SW
```

### Push events (notifications)

The service worker's push events are what will be used to *receive data from a remote server.* Push event means that the server is sending data to the application *without the application requesting it*. Service workers are capable of responding to that data

We can listen to the **`push`** event in the service worker

```javascript
/* sw.js */
self.addEventListener('push', e => {
	console.log('Push received');
});
```

We can simulate a push event from the devTools in chrome (Application > service workers > "push" link)

**Note**: Push notifications are received by the service worker *regardless* of whether the user has the application open or not!

## Notifications

The Notifications API (in HTML5) is used to configure and display desktop notifications to the user. These notifications' appearance and specific functionality vary across platforms but generally they provide a way to asynchronously provide information to the user.

Whenever we receive push notifications (`push` event in SW) and the likes, we can use the Notifications API to display those messages to the user

**Check for support**

**`window.Notification`**. 

**Display a notification**

**`new Notification(<title>, <options>)`**: Shows a notification popup on the user device's screen

**Permissions**

The users need to explicitly give permission to the app in order to show notifications. This permission (**`Notification.permission`**) can be of 3 types:

- `granted`: Can display notification
- `denied`: Cannot display notifications (blocked). We cannot even request permission once again
- `default`: Whatever the browser has been configured to have as its default setting

**Requesting permission**

**`Notification.requestPermission(<callback>)`** & the callback receives the new permission value (one of the above 3)

```javascript
/* main.js */
function showNotif() {
	new Notification('Notification'); // Displays the notification on the user's device
}

if(window.Notification) {
	if(Notification.permission === 'granted') {
		showNotif();
	} else if(Notification.permission !== 'denied') { // can't do anything if denied
		Notification.requestPermission(permission => {
			if(permission === 'granted') {
				showNotif();
			}
		});
	}
}
```

The timing of the permission is important. We want to ask the user only when he intends to perform a task that requires notifications. Once the permission has been denied, it can only be changed from the settings in the browser (Lock icon in URL bar is a shortcut), which the average user is unlikely to do. Same thing applies for a user who has given a permission. To change that, he needs to go the settings again (unlikely that an average user will do that)

**Customize a notification**

We can pass a notification options, an object, to the `Notification()` constructor. It contains a `body` (description) and `icon` property (path to an image)

```javascript
function showNotif() {
	let notifOptions = {
		body: 'Body of the notif',
		icon: 'thumb.png'
	}
	
	new Notification('Notification', notifOptions);
}

if(window.Notification) {
	if(Notification.permission === 'granted') {
		showNotif();
	} else if(Notification.permission !== 'denied') { // can't do anything if denied
		Notification.requestPermission(permission => {
			if(permission === 'granted') {
				showNotif();
			}
		});
	}
}
```

**Clicking on a notification**

The default behavior of a click on a notification is to *focus* on the app in the browser. If we want to add functionality to this click, we can attach an event handler. Store the Notification object created in a variable and define a function on its already available **`onclick`** property

```javascript
function showNotif() {
	let notifOptions = {
		body: 'Body of the notif',
		icon: 'thumb.png'
	}

	let notif = new Notification('Notification', notifOptions);
	
	notif.onclick = () => {
		// Do your own thing:
		console.log('Notification was clicked');
	}
}
```

### Server Push and Push Notifications

Push service is an intermediary service provided by a *third-party* of some sort. This is generally coming from the browser provider. Ex: When using chrome, that push service will be google firebase cloud messaging (it is used automatically in the background by chrome, not needing signup). Therefore, firebase cloud messaging is the *push service*, while firebase itself is the *push server*!

1. When an app (webpage) subscribes to a push service, it is in turn given an ***auth key*** (for authentication)
2. A push server (that has knowledge of an application's push service credentials via the auth key) can send encrypted push notifications (as ***payloads***) to the push service
3. The push service will ***forward these payloads*** to the web app that has subscribed to them
4. The forwarded payloads are received in the ***push events*** of the service worker

**Note**: The push server maintains a *private* and a *public* key pair. The application knows the *public* key. Using this public key, it able to access & decrypt the encrypted payloads sent to it as push notifications.

**`self.registration`**: Returns the registration object we get when registering a service worker

**`self.registration.showNotification(<title>)`**: Returns a promise. To make sure that our worker stays active until the duration of this notification, pass it to the `e.waitUntil(<promise>)` method

```javascript
/* sw.js: */
self.addEventListener('push', (e) => {
  let n = self.registration.showNotification('A notification from the SW.');
  e.waitUntil(n);
});
```

**Creating a push server (for development purposes)**

- We can use a node module called **`web-push`**. Install it globally. This command allows us to *generate a key pair* for use in our push server

- **`web-push generate-vapid-keys`**: ["Vapid"](https://tools.ietf.org/html/draft-ietf-webpush-vapid-01) is the specification used by a push server to identify itself to the push service. It generates the 'public' and 'private' keys. You can see the output in JSON format in the terminalby passing the `--json` option to the command

  ```bash
  web-push generate-vapid-keys --json > vapid.json
  ```

  ```json
  /* vapid.json: */
  {
  	"publicKey": "BJ9y8mVCI6z3lvI-CgNoA9bVuYXFrpEUnjGCdA0RB3g0U8RhI5QWwICgiVCI6TkXwU-lNPU6Dxx3LTe0OdoQwmQ",
  	"privateKey": "GssZFRr-4Pcm83AJSF2Fz1m0tXeqow3dUfRfZHcD8q8"
  }
  ```

- We can use this json file (include them) to access the key-value pairs. Next step is to configure the web push module to use these keys with **`setVapidDetails(<mailto>, <public>, <private>)`** method. This identifies the push server to the push service

  ```javascript
  /* push-server.js: */
  // Web-push Module
  const webpush = require('web-push');
  const vapid = require('./vapid.json');
  
  // Configure keys
  webpush.setVapidDetails(
    'mailto:ray@stackacademy.tv',
    vapid.publicKey,
    vapid.privateKey
  );
  ```

- We still have not attached the push service to the push server (Known as the *push subscription*). We need an ***endpoint*** and ***two keys*** (the *client auth key* and the *public encryption key*). These are shared during setup

```javascript
const pushSubscription = {
  endpoint: '...',
  keys: {
    auth: '...',
    p256dh: '...'
  }
};
```

- Finally, we can send notifications from the push server to the web application through the push service by using the **`webpush.sendNotification(<subscriptionDetailsObj>, [<notification title>])`** method. The notification title (optional) won't be relevant if we are showing our own notification from the service worker listening to the push event

```javascript
webpush.sendNotification(pushSubscription, 'A notification from the push server');
```

**Example push server setup**:

```javascript
/* push-server.js: */
// Web-push Module
const webpush = require('web-push');
const vapid = require('./vapid.json');

// Configure keys
webpush.setVapidDetails(
  'mailto:ray@stackacademy.tv',
  vapid.publicKey,
  vapid.privateKey
);

const pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/cldZxQiy4po:APA91bHfAsEnvwrKhdF4E1Ek_KwG7l_xRAxXEFJX1WDsGlMFB9OEONYnh19GBs7I_3RLcp6eemPcJLSvoWLEFzpxmZKJh5A_LdlweLbPXX36UiT4MT_8I8bBoJlPV4Kfxu0P9cn_K2FP',
  keys: {
    auth: 'zQm_SqVjAWXEgkzmDKNmNQ==',
    p256dh: 'BCycPnH5W7FOTuj8u079SBwTRpso_DrS5teX4jNJcdvZxCDOXUj9OfLc1f5y4yJfqJA0b49E9Y0JtLszpHuxQGA='
  }
};

webpush.sendNotification(pushSubscription, 'A notification from the push server');
console.log('Push sent to client'); // runs if push was successful
```

On the **client side (app)**, say, in `main.js`, we:

1. Have the **public key**
2. Need to check if we can get a subscription, using **`registration.pushManager.getSubscription()`** which returns a promise
3. The `then` callback has the subscription object, which is a promise. If subscription really exists then we can chain another `then` to convert this subscription to a json object `toJSON()`
4. If subscription object was not found, we need to subscribe again! We use the available **`registration.pushManager.subscribe({ ... })`** method which returns the subscription promise if successful (like in step 2)

`registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`

`userVisibleOnly` means that the notification will be visible only to the user and no one else. 

`applicationServerKey` is the public key we created on the server (`vapid.publicKey`). The difference is that, on the client-side, we have to pass this public key in a different format. The public key is in `base64` format and we have to send it in `Uint8Array` format! We can write a function to do this conversion

```javascript
/* main.js: */
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    // 1. Server public key
    let pubKey = 'BA_p1nmsMgd.......a0539pVuUXMf3O4.....GNteM';

    registration.pushManager.getSubscription().then((sub) => {
      // 2. If subscription found, return
      if (sub) return sub;

      // 3. Subscribe if subscription not found
      let applicationServerKey = urlBase64ToUint8Array(pubKey);
      return registration.pushManager.subscribe({
          userVisibleOnly: true, 
          applicationServerKey
      });
    }).then( sub => sub.toJSON() ) // 4. convert subscription to JSON format
      .then(console.log)
      .catch(console.log);

  }).catch(console.log); // 5. catch errors in any of these steps
}



// Convert key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
```

```json
/* Output of main.js: */
{
    endpoint: "https://fcm.googleapis.com/fcm/send/c6KlKYBmhCs:AP…uNsVZLxgSCDTSJC3kUh7Pm14gZL58sCLiLE0OaiqmquIdd4sK", 
    expirationTime: null, 
    keys: { 
        auth: "OFCk5Jg0NRT7hVScUvS10A",
        p256dh: "BCyK3cY_mLO2CmFDHFVG3eWrE-B9O4DIhM1yLzBC65BloESSYxQ91nSOMngz2KUOlN1vPfp4oT27vpFW2OCWr2U"
    }
}
```

**Note**: 

1. The Subscription works on the *same permissions* as the Notifications! That is, you grant one you grant the other automatically, you deny one and you deny the other automatically 
2. Once we get the subscription object from the `main.js` above, we can share the `endpoint` and `keys` to the `push-server.js` (the push server) by POSTing the data to it (or copy pasting)
3. Run **`node push-server.js`** and if we get console message, it means that everything works well & push was successful

## Caching

We can cache data so that:

1. It is available offline
2. Loads data instantaneously
3. Reduces the data costs

We have many options for storing data locally. However, we *do not* want synchronous options, because they block the javascript (& render?). Therefore, the `localStorage` option is *discarded!*

1. **IndexedDB**: A very powerful DB but the API is very complex and not friendly enough to the user implementing it
2. **Cache API**: A somewhat newer API - designed to work with service workers and the fetch API. It uses promises
3. **pouchDB**: A library that allows you to sync data between different devices by syncing with the cloud. If you need to support multiple devices and have them synced, pouchDB is a good option
4. **local forage**: Also a third party library. It selects the best available storage option. Therefore, if you need to support devices that have browsers not supporting service workers, caching can still work with this library
5. Web SQL
6. lovefield

### Cache & CacheStorage API

There are two APIs that work close together: [CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) & [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache). Service workers come with cache support

CacheStorage is like the interface to each cache object (each DB instance). We interact with the cache storage first in order to interact with the cache

**Checking for support**

**`window.caches`**: If this property exists, the cache API is supported. Note that if service workers are supported, cache API is automatically supported

**Creating a cache storage**

We use the **`caches.open(<name>)`** method. This checks for a cache storage by the given name and opens it for reading/writing. If it does not exist, it gets created!

This method returns a *promise* so we can attach the then callback to it

You will need to right-click *Cache Storage* and select '**refresh cache**' in the cache option of the application tab in Chrome devTools

```javascript
/* main.js */
if(window.caches) {
	caches.open('test1'); // opens a cache storage
	caches.open('test2'); // opens a new cache storage
}
```

**Checking all the cache storages**

Use **`cache.keys()` ** method which returns a promise. The callback gets an array of the names of all the cache storages

```javascript
if(window.caches) {
	caches.keys().then(console.log); // ["test1", "test2"]
}
```

**`has(<name>)`** checks if a specific cache storage exists. This also returns a *promise*

```javascript
if(window.caches) {
	caches.has('test2').then(console.log); // true
	caches.has('test3').then(console.log); // false
}
```

**`delete(<name>)`** deletes a cache storage, returns a promise that holds `true` if successfully deleted

```javascript
if(window.caches) {
	caches.delete('test1').then(console.log); // true
}
```

You may need to 'refresh cache' on the *cache storage* to see the changes in the the devTools

**Cache operations**

Once we open a CacheStorage, inside the then callback, we get the *individual cache*. We can perform *Add & Delete operations* on this individual cache (individual DB)

The caching is NOT as key-value pairs. Instead, cache API helps us cache requests and save the response. These are the same requests and response objects used in Service workers (`fetch`) when you intercept requests as a proxy. Therefore, integration of Cache API with Service Workers becomes very easy

*Methods*:

- **`add(<path-to-file>)`**: Caches the file specified. It does a `fetch` in the background and saves the received response to the original request
- **`addAll([<path-to-file>, ...])`**: Similar to `add` but cache multiple requests (array of requests)

Both `add` and `addAll` accept URL path strings as well as actual file paths!

**Note:** If one of the requests fails, the complete `addAll` fails. Therefore, be careful to group together only local (own server) assets and not CDN libraries (ex: jQuery). If CDN is down, even our own assets wont be cached and results in an error!

```javascript
if(window.caches) {
	caches.open('pwa-v1.1').then(cache => {
		cache.add('/index.html'); // Ex: caches the "localhost:8080/index.html" file
	});
}
```

```javascript
if(window.caches) {
	caches.open('pwa-v1.1').then(cache => {
		cache.addAll([
			'/index.html',
			'/style.css',
			'/main.js'
		]);
	});
}
```

- **`delete(<path-to-file>)`**: Delete a particular file/request cache

```javascript
if(window.caches) {
	caches.open('pwa-v1.1').then(cache => {
		cache.delete('/index.html');
	});
}
```

- **`match(<path-to-file>)`**: Matches a particular request and returns a promise that when resolves gives the response object. It is the *same* response object returned in the `fetch` event listener of a service worker.

If we pass a request object to `match`, it returns the stored-in-cache response object for it

```javascript
if(window.caches) {
	caches.open('pwa-v1.1').then(cache => {
		cache.match('/index.html').then(console.log);
	});
}

/* Output:
Response {type: "basic", url: "http://localhost:8080/index.html", redirected: false, status: 200, ok: true, …}
*/
```

```javascript
if(window.caches) {
	caches.open('pwa-v1.1').then(cache => {
		cache.match('/style.css').then(res => {
			res.text().then(console.log);
		});
	});
}

/* Output:
body {
  padding: 1rem;
  font-family: 'Lato', sans-serif;
}

a {
  color: #2D91F8;
  padding: 0.25rem 0.5rem;
  text-decoration: none;
}

img {
  max-width: 100%;
}
*/
```

**Note**: The `add` method basically does a **background `fetch`** operation on the request we pass it and stores the response object

- **`put(<path-to-file>, <Response Object>)`**: This method allows us to what gets stored as th response to a request in the cache. Remember, `add` internally fetches and saves response for a request? Here, we explicitly save a custom response (second param) to a request

How is `put` useful? It is useful when we already have a response we need to store and do not wish to perform a `fetch` operation like it happens in `add`.

`put` helps us pair any request to any response

```javascript
if(window.caches) {
	caches.open('pwa-v1.1').then(cache => {
		cache.put('/index.html', new Response('<h1>My custom HTML</h1>'));
	});
}
```

- **`keys()`**: Gets all the request paths that were cached in this cache. Returns a promise and when that resolves, the callback has access to all the request objects in an array.

```javascript
if(window.caches) {
	caches.open('pwa-v1.1').then(cache => {
		cache.keys().then(console.log);
	});
}

/* Output:
[Request, Request, Request]
*/
```

**Note**: 

1. Cache keys are request objects, and the values are response objects
2. We can see the internal `fetch` that `add` method does to fetch and cache a response to a request in the **Network** tab of chrome.

### Caching in the Service Worker

*Steps*:

1. **Initial setup**: all the caching we want to perform immediately when the service worker is installed (Ex: static assets like the main HTML structure, stylesheets, images, and linked javascript files). All this caching is done when the SW is installing (inside `install` event listener)

```javascript
/* main.js: */
if (navigator.serviceWorker) { // OR: if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  	.then(registration => {})
  	.catch(console.log);
}
```

```javascript
/* sw.js */
const pwaCache = 'pwa-cache-1';

self.addEventListener('install', e => {
	let cacheReady = caches.open(pwaCache).then(cache => {
		console.log('New cache ready');
		return cache.add('/');
	});

	e.waitUntil(cacheReady);
});
```

`cache.add` can be seen in the `Networks` tab of the chrome devTools. The *gear icon* indicates that the request was initiated by a service worker

2. **Intercepting `fetch` and returning cached content**: SWs are proxies and if cached content is available, we can pass that from inside the `fetch` event listener of a SW

```javascript
/* sw.js */
// Service Worker
const pwaCache = 'pwa-cache-1';

self.addEventListener('install', e => {
	let cacheReady = caches.open(pwaCache).then(cache => {
		console.log('New cache ready');
		return cache.add('/');
	});

	e.waitUntil(cacheReady);
});

self.addEventListener('fetch', e => {
	if(e.request.url === 'http://localhost:8080/') {
		let newRes = caches.open(pwaCache).then(cache => {
			return cache.match(e.request);
		});
		e.respondWith(newRes);
	}
})

/* 
Status Code: 200 OK (from ServiceWorker)
*/
```

Each cache entry is **unique to its request**. It is not unique to the response. Ex: `cache.add('/')` will not work for `/index.html` request, it ONLY works for `/`!

3. **Serving any file local to app from cache**: Since external libraries' unavailability can cause errors in caching and in the script, we exclude them. But, for every other local-to-app static resource, we can check if cache exists and then serve it from there or else fetch and return

```javascript
/* sw.js: A more generic caching technique (check for cache on the fly) */
const pwaCache = 'pwa-cache-1';

self.addEventListener('install', e => {
	let cacheReady = caches.open(pwaCache).then(cache => {
		console.log('New cache ready');
		return cache.addAll([
			'/',
			'style.css',
			'thumb.png'
		]);
	});
	e.waitUntil(cacheReady);
});

self.addEventListener('fetch', e => {
	// Skip for remote fetch:
	if(!e.request.url.match(location.origin)) // regex 'match'
		return

	// Serve local file from cache
	let newRes = caches.open(pwaCache).then(cache => {
		return cache.match(e.request).then(res => {
			// Check if request was found in cache & return it
			if(res) {
				console.log(`Serving ${res.url} from cache`);
				return res;
			}

			// If not found, fetch on behalf of service worker:
			return fetch(e.request).then(fetchRes => {
				// Don't use `add` since it will perform another fetch internally
				cache.put(e.request, fetchRes.clone());
				// save a clone because a fetch response can only be consumed once!
				return fetchRes;
			});
		})
	});

	e.respondWith(newRes);
})

/* THIS METHOD IS USEFUL FOR LOADING SCRIPTS THAT LOAD THE SERVICE WORKER ITSELF - LIKE main.js - WE DON'T LOAD IT INITIALLY DURING INSTALLATION OF SERVICE WORKER - BECAUSE THEN WE CANNOT UPDATE THE SERVICE WORKER - BUT DO SO ON THE FLY, WHEN IT IS BEING REQUESTED (AFTER SERVICE WORKER HAS BEEN REGISTERED) */
```

The above technique caches every request! Therefore, we can serve the entire app from the cache. This can be tested by ticking the `offline` checkbox in the `Network` tab and reloading the page. The page must still load in offline mode since all our resources were cached

**Updating the cache**

If we have removed certain files or modified them, we do not want the cache to still serve them - we want those files *removed* from the cache!

This can be done by updating the cache - changing the cache name (in `caches.open(<name>)`) so that we are *using the new cache* and remove the old one, with its old files!

This is the reason why the cache name was supplied with a version number (`const pwaCache = 'pwa-cache-1'` in the previous examples)

```javascript
/* sw.js */
// Service Worker
const pwaCache = 'pwa-cache-2'; // new cache name (new version!)

self.addEventListener('install', e => {
	let cacheReady = caches.open(pwaCache).then(cache => {
		console.log('New cache ready');
		return cache.addAll([
			'/',
			'style.css',
			'thumb.png',
			'main.js'
		]);
	});
	e.waitUntil(cacheReady);
});

/* Cleanup (remove) older caches: */
self.addEventListener('activate', e => {
	let cacheCleaned = caches.keys().then(keys => {
		keys.forEach(key => {
			if(key !== pwaCache)
				return caches.delete(key);
		})
	});
	e.waitUntil(cacheCleaned); // wait until cache is cleaned (i.e promise resolves/rejects)
});

self.addEventListener('fetch', e => {
	if(!e.request.url.match(location.origin)) return;

	let newRes = caches.open(pwaCache).then(cache => {
		return cache.match(e.request).then(res => {
			if(res) {
				console.log(`Serving ${res.url} from cache`);
				return res;
			}
			return fetch(e.request).then(fetchRes => {
				cache.put(e.request, fetchRes.clone());
				return fetchRes;
			});
		})
	});
	e.respondWith(newRes);
});

// Cache cleanup: Does not leave behind anything unnecessary in the user's device
```

**Limitations of caching in this way**

1. The cache storage will be limited by a number of factors, including the overall space available to the user
2. Make sure not to leave old caches behind

### Caching strategies for PWAs

Questions to be asked in order to form a strategy: 

1. Can the resource be served offline? (cached): Only if the content is *static* or *changes infrequently*. We must not cache the content that changes too often (live data)
2. Is it acceptable to display this content in its most recent version as opposed to the live version? Something like a comments feed can be shown with the most recent version, and when the network is available, we can load the live version
3. What is more important? *Performance* or *Age*?: Loading from cache provides a significant performance benefit (over fetching from a network). Is this performance benefit more useful that loading live data (most up to date data)?

There are about 6-7 common strategies: 

1. ***Cache only***: Serve data only from the cache (good for static assets like the *App shell* - HTML, CSS, etc that make up the application itself and NOT its content)
2. ***Network only***: This involves no caching since we are always fetching data from the network and displaying that
3. ***Network First (with Cache Fallback)***: Good for data that still holds value in its older version but should ideally be up to date. (Ex: comments' feed). We always fetch & update the cache (ensuring cache has latest version). If network is down (`.catch()` method of `fetch`), serve from cache
   - *Drawback*: In poor network conditions, the `fetch` is dispatched but it takes ages for the response to come back - and fetch hasn't failed but is only delayed - so data is not served from cache either. User is forced to wait a long time, leading to a poor experience
4. ***Cache First (with Network Fallback)***: Same as *cache only* (1) but if match fails, it goes to network to fetch a fresh response
5. ***Cache First (with Network Update)***: We serve the resources *immediately* from the *cache* and then updates the cache in the background so that on the *next reload*, the cache content is as up-to-date as possible. This is not good enough for live data but if such a compromise is acceptable, then it can be implemented since cache will be having *almost* up-to-date data
   - This is like getting the live data on *second reload*!
6. ***Fastest (Cache & Network Race)***: Most advanced strategy. We have to dispatch a fetch and the cache request at the same time, and use the one which responds with data first (the quickest). On some devices, the disk access might be slower than network requests, and cache could take more time than network requests (unlikely, but possible)
   - We cannot simply use `promise.race()` because even a `404` error page will get resolved first, and if cache resolves first, it is returned no matter what - not reliable!
   - We have to write a custom function that returns a promise - we respond with this promise
   - Inside the promise, we try the asynchronous `fetch` and the asynchronous `caches.open` methods, resolving as soon as whichever has got the correct response
   - Both of these requests (fetch and cache) could be rejected, but if one rejects, we want to still wait for the other. So, we only return a rejected response if both fail, otherwise, we wait for the other to, hopefully, resolve. (We can write a function to track the rejection count using a flag variable)
   - Therefore, first reject means wait for the other one to finish. Second reject means resource not found, send rejected response
7. ***Providing placeholder content***: This is *not* a separate strategy, it works with all the other 5 strategies. We can provide fallbacks for resources that are not in cache and we are offline! Check code below (6).
   - Example: Placeholder image for failed image request (failed in cache + fetch)
   - Example: Placeholder text for some text resource (failed in cache + fetch)

Strategy is worth spending some time on before developing your application! The above list of 5 strategies has been explained in the code below:

```javascript
/* sw.js: */
// A. Cache name
const pwaCache = 'pwa-cache-1';

// B. Static assets to cache on install
const staticCache = [ '/', 'index.html', '/placeholder.png', '/style.css', '/main.js', '/thumb.png' ];


// C. SW fetch handler with different caching strategies
self.addEventListener('fetch', (e) => {


  // 5. Cache & Network Race with offline content
  let firstResponse = new Promise((resolve, reject) => {

    // Track rejections
    let firstRejectionReceived = false;
    let rejectOnce = () => {
      if (firstRejectionReceived) {
		// 6. optional, additional step: have a fallback for failed image requests:
        // if (e.request.url.match('thumb.png')) {
        //  resolve(caches.match('/placeholder.png'));
        // } else {
          reject('No response received.')
        // }
      } else {
        firstRejectionReceived = true;
      }
    };

    // Try Network
    fetch(e.request).then( (res) => {
      // Check res ok
      res.ok ? resolve(res) : rejectOnce();
    }).catch(rejectOnce);

    // Try Cache
    caches.match(e.request).then( (res) => {
      // Check cache found
      res ? resolve(res) : rejectOnce();
    }).catch(rejectOnce);

  });
  e.respondWith(firstResponse);


  // // 4. Cache with Network Update
  // e.respondWith(
  //   caches.open(pwaCache).then( (cache) => {
  //
  //     // Return from cache
  //     return cache.match(e.request).then( (res) => {
  //
  //       // Update
  //       let updatedRes = fetch(e.request).then( (newRes) => {
  //         // Cache new response
  //         cache.put(e.request, newRes.clone());
  //         return newRes;
  //       });
  //
  //       return res || updatedRes;
  //     })
  //   })
  // );

  // // 3. Network with cache fallback
  // e.respondWith(
  //   fetch(e.request).then( (res) => {
  //
  //     // Cache latest version
  //     caches.open(pwaCache).then( cache => cache.put(e.request, res) );
  //     return res.clone();
  //
  //   // Fallback to cache
  //   }).catch( err => caches.match(e.request) )
  // );

  // // 2. Cache with Network Fallback
  // e.respondWith(
  //   caches.match(e.request).then( (res) => {
  //     if(res) return res;
  //
  //     // Fallback
  //     return fetch(e.request).then( (newRes) => {
  //       // Cache fetched response
  //       caches.open(pwaCache).then( cache => cache.put(e.request, newRes) );
  //       return newRes.clone();
  //     })
  //   })
  // );

  // // 1. Cache only. Static assets - App Shell
  // e.respondWith(caches.match(e.request));

});


// D. SW install and cache static assets
self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open(pwaCache)
        .then( cache => cache.addAll(staticCache) )
    );
});

// E. SW Activate and cache cleanup
self.addEventListener('activate', (e) => {
    let cacheCleaned = caches.keys().then((keys) => {
        keys.forEach( (key) => {
            if (key !== pwaCache) return caches.delete(key);
        });
    });
    e.waitUntil(cacheCleaned);
});

```

## Adding Native App Features

We can make our PWA behave like a native app by specifying a **`manifest.json`** file. It allows the web app to leave the browser and become standalone like a native web app

It is a `json` file that is declarative and does not require any coding

- `name`: Full app name (not the icon name)
- `short_name`: The short name shown below the icon on home screen
- `start_url`: The URL that the app should start with. We don't have a URL bar in a home screen PWA, so we have to configure which page to open everytime the app starts
- `display`: Defines how the app is displayed. 
  - `fullscreen` for full screen mode (no status bar)
  - `standalone` for native-app like feel with a status bar
  - `minimal-ui` for minimal browser experience, and 
  - `browser` for the traditional browser experience. 
  - If one of them is *not* supported, the next one is applied. Ex: if `fullscreen` is specified but it is not supported then `standalone` is applied...
- `background_color`: Background color of the app's splash (launch) screen
- `description`: Description of the app when viewing the app info on the device
- `icons`: An *array* of icons. It takes icon objects `{}`. Each icon object has:
  - `src`: Path to the icon file
  - `sizes`: Size of the icon (Can be multiple, space-separated icon sizes)
  - `type`: MIME type of the icon image

```json
/* manifest.json: */
{
  "name": "Progressive Web App",
  "short_name": "PWA",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#2D91F8",
  "description": "Progressive Web Apps - The Complete Guide",
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
       "src": "/icons/icon-96.png",
       "sizes": "96x96",
       "type": "image/png"
     },
     {
       "src": "/icons/icon-128.png",
       "sizes": "128x128",
       "type": "image/png"
     },
     {
       "src": "/icons/icon-144.png",
       "sizes": "144x144",
       "type": "image/png"
     },
     {
       "src": "/icons/icon-152.png",
       "sizes": "152x152",
       "type": "image/png"
     },
     {
       "src": "/icons/icon-192.png",
       "sizes": "192x192",
       "type": "image/png"
     }
  ]
}
```

**Adding manifest file to our app**

We add a `link` tag with attributes `rel=manifest` and `href=<path-to-manifest-file>` in the `<head>` of our our webpages

```html
<link rel="manifest" href="/manifest.json">
```

**Add to home screen**

*Via dialog box*: When we have a proper manifest file that is linked to a web app, visiting it in the browser will prompt the user to download a home screen app. This app will have the `start_url` property value in the manifest as its starting point

*Manually*: We can also manually choose to add the app to the home screen by going to settings of the browser from a mobile device and clicking `add to home screen`

**Q: How do we trigger the add to home screen dialog box?**
A: We do not or cannot trigger it. The browser decides when to display it to the user. It is dependent on the following criteria which must be met:

1. Our app has a valid `manifest.json` file & this file must specify at least the `name`, `short_name`, `start_url`, and a `144x144` icon image of type `image.png`
2. Our app must contain a *registered service worker*
3. It must be *served over HTTPS* (which is anyway a requirement of service workers (2))

When the above criteria is met, the dialog is shown to the users when they visit the page at least twice with a minimum of 5 minute delay between them!

**Note**: The devTools has an option to trigger the dialog when debugging a PWA on the real device with USB debugging. Just inspect the device from devTools and click on `add to homescreen` link, it must popup that dialog box!

**Making PWA work on iOS devices from Safari**

PWAs that work on android work on iOS as well but there are two limitations:

1. App cache is limited: **`50`** MegaBytes (which is sufficient in most cases, so a minor problem)
2. Icons mentioned in manifest are not supported: We need to specify icons for the home screen and the splash screen in apple phones in a non-standard way (Note: [apple icons & links generator](http://www.favicomatic.com/))

The generated links in step 2 can be copied over to your app's `<head>`. This will add the necessary definitions to include your icons for the app on iOS (apple phones)

Splash screen and icons for PWA on iOS: [Follow through this 5 minute video](https://www.udemy.com/progressive-web-apps/learn/v4/t/lecture/7241306?start=0)

## Bonus Content: How Flipkart Built Their PWA (2016)

[SOURCE: REACT FLIPKART YOUTUBE](https://www.youtube.com/watch?v=m2tvYGCdOzs)

- **App Shell**: This is the very basic scaffolding (layout HTML) of the app that we want visible immediately to the user. It represents the ***loading state***! When other views (outside app shell) load, we get the complete loaded state. The app shell is responsible for loading the other views after it gets loaded
- In *React*, you can maintain a flag to indicate loading vs loaded state - ***Declarative*** way. And, we'd display our views accordingly. Therefore, initially the flag suggests loading and only the app shell (loading state) is visible
- If you are doing SSR then `renderToString` in React is very ***CPU intensive*** (expensive operation). Therefore, we should try to serve our App Shell in a static way (combine all static content during the build process)
- To make our app shell render quickly, we ***embed critical CSS*** (for above-the-fold content) into the app shell. This renders the CSS for the shell quickly, without having to request an external CSS script
- You may treat only the essential or critical (live) data as network requests. Everything else can be thought of as non-essential and be served from cache. Therefore, we go with the ***offline first strategy*** where you serve from cache first.
- Implementing a cache strategy will automatically improve network and therefore, render performance!

**App Shell Architecture** versus **Conventional Server-Side Rendering (SSR)**:

1. *Improves Time to First Paint?*: Both techniques improve it
2. *Is it possible to render during build time?*: This is not possible in Conventional SSR because the rendering is dynamic w.r.t routes (route-based) and hence, the HTML is finalised only when the route is hit! We cannot produce static content during build. However, this is *possible in app shell architecture* since we move all static content to one side during build process. If we have different routes that vary greatly in the shell, we can have an app shell each for those varying routes
3. *Client Side Caching*?: Does not work with the conventional SSR. It works with App Shells because we can have a Service Worker intercept requests (it is a proxy) and supply cached data as response from a storage on the client side
4. *Reuse across URLs?*: Cannot by done in conventional SSR. In app shells, the shell can be reused across millions of URLs of the same type. Ex: One app shell for all product pages - since they have the same basic layout
5. *SEO?*: It is easier to do this with conventional SSR. But, it is not impossible to do it in app shell architecture - can be done

**Quick Win**:

Most modern browsers support ***rasterization*** (converting vectors (images) to bitmaps for the final paint) on the GPU on most mobile devices. *This improves rendering performance*! All you have to do to enable this is add the viewport meta tag with the following options:

```html
<meta name="viewport" content="width=device-width, minimum-scale=1.0">
```

## The PRPL Pattern

[Source: Hackolabs YT](https://www.youtube.com/watch?v=pN9ABRkfwdI)

PRPL is a pattern that helps you ***load pages faster*** & ***load more reliably***. PRPL is not one specific thing but a ***set of different techniques*** that you can apply to your webpage!

The concept:

1. **(P)USH** the most *critical resources*.
2. **(R)ENDER** the *initial route* as soon as possible (Pushed critical resources in Step 1 help with rendering ASAP)
3. **(P)RE-CACHE** all of your *remaining resources*
4. **(L)AZY LOAD** all of your *remaining routes*

**Q: Why PRPL?**
A: Over the years, *mobile traffic has outgrown desktop traffic*, and *unique visits on browser is greater than unique downloads in the playstore*. Therefore, it is easier for a new web app to reach out a new user and engage him (either on site or with a home screen app (pwa)) than it is to get someone to download a new app. Therefore, we need to make use of these stats by optimizing our web apps using an optimization pattern like PRPL!

### Network Latency

**Q: How traditional requests work & what are the negative effects?**
A: Traditional requests work like this:

1. Request the page from server = 1 round trip time (Request + Response circle)
2. Parse the HTML 
3. Request every resource that appears while parsing HTML & while executing CSS & JS (styles/scripts/etc) = 1 round trip time for each

We want to *reduce these round trip times* as they increase the network latency (delay, bad!)

**Solution(s)**

1. **`<link rel="preload" src="[resource-path]" as="[script/style/image/font/video/..]">`** in the `<head>` of your document 
2. Use **`HTTP/2` Server Push**

**(A) `preload/prefetch`**

Preload lets us tell the browser which resources we need immediately after the page loads ('Hey, this resource is really important, so please download it as soon as you can')

**Q: What resources must be fetched by preloading?**
A: We can fetch resources like stylesheets and the main javascript file but doing so does not provide such a big benefit - because they are already going to be fetched on load. The real benefit occurs when you preload resources such as fonts, media, scripts, etc that are embedded in say, CSS or JS (that was downloaded on page load). When these are requested by an executing script or through CSS parsing, they are immediately available!

**Q: What is `rel="prefetch"` then?**
A: It is similar to `rel=preload` but it wants to load resources before hand for *another route*! For example, if you are on the home page and you have a resource on the product page, from home page you can prefetch a resource required by the product page. So, what is the difference? The browser knows that `prefetch` labelled resources are low priority compared to the current route's resources - so it will fetch them later (after downloading current page's resources). `preload`, on the contrary, takes the highest priority!

Webpack tool to make it easy to add `preload` and `prefetch`: **`preload-webpack-plugin`**. This plugin helps create preload/prefetch tags for *particular chunks* that get created for your major bundles

**Browser support for `preload` and `prefetch`**

Chrome, Safari, and Opera support them. Firefox has partial support. Edge still does not support it

**(B) `HTTP/2` Server Push**

Apart from using preload and prefetch, we can *send (additional) critical resources directly to the client* from the server before the client even requests for it.

For example, we can send all the critical CSS and scripts to the browser when it asks for the HTML of the route. This has to be configured on the server and is only possible if protocol used in HTTP/2 (ex: Firebase hosting)

```
Link: </app/style.css>; rel=preload; as=style
Link: </app/script.js>; rel=preload; as=script
```

The format is similar to the `<link>` format in the HTML.

Using `preload` in the head and *no* push from server (disable push for a resource):

```
Link: </app/style.css>; rel=preload; as=style; nopush
```

```html
<link rel="preload" src="/app/style.css" as="style">
```

**The problem of pushing too much!**

When the server pushes something, it is an automated internal request. If we push too many or all our resources then pushing might result in increase of page load time as opposed to reducing it!

1. Push ***only critical resources*** (decreases page load time)
2. Do not push unused assets (bandwith gets wasted)

**Drawback of HTTP/2 Server Push**

The server is *not aware* of the browser cache. So, even if we have a resource that is cached, the server will still push the same resource. It increases the data costs. Solution? Combine it with service workers

### Service Workers

The service worker is a script that runs in the background of your browser when you view a webpage.

*Options*:

1. Write a service worker 
2. Use a service worker library [Google's WorkBox](https://developers.google.com/web/tools/workbox/)

```
npm i -g workbox-cli

workbox-cli generate:sw 
```

**Q: What can we use a service worker for?**
A: It can be used for the following things:

1. App Shell: The shell of the user interface that does not contain any real content. We can cache the shell & its corresponding content
2. Dynamic Content Caching: This can be caching of data. That is, ***runtime caching***!

Therefore, Service Workers are good for **App Shell + Dynamic Content Caching**. This combination allows us to provide:

- *Offline support*, and
- *Faster Repeat Visits* (not just shell, even content is being cached)

### Bundles & Code-Splitting

Bundle sizes are getting bigger and bigger! There is a need to trim down or separate out code into smaller bundles. This is done through ***code-splitting***

For example, if you are on the login page of an app, do you require the entire JS bundle that includes the entire website's functionality? 

Philosophy: *When you are on a route, get the JS for the route only when you are there* (& not viewing some other route)!

To check sizes of different parts of code, you can use `webpack bundle analyzer` tool!

**Lazy Loading the remaining routes**

With code splitting, we are not bundling the code required for a route until it is hit upon. Therefore, we are lazy loading the remaining routes - if user never visits these routes, they are never going to needed, so we will never need to use them!

### Summary

**METRICS**

1. Time to first meaningful paint (TTFP / TTFMP)
2. Time to interactive (TTI)

# PRPL (Performance of PWAs)

[Source: Planning for Performance (PRPL) - Chrome Dev Summit](https://www.youtube.com/watch?v=RWLzUnESylc)

**Improving Network Latency**

- **`link rel="preload" href="<path-to-resource>"`**
  - When you mention something as a preload resource, that resource is downloaded by the browser in the background even though you do not request the resource! The next time this resource is requested, browser says, "I've got it!". 
  - So, we can preload certain things that we think that the app is going to request soon by placing paths to these resources in the preload link tags
  - Preloading must work *well* in ***HTTP2*** (Get this confirmed!). The reasoning is the multplexing of resources - you download them in parallel without a waterfall model (but intertwined) and if a script depends on another script, we use the one that was preloaded
  - Preloading is extremely useful for "*late discovery documents*". These are *fonts*, *lazy-loaded scripts* that are created by build tools as a result of code splitting and *module splitting*.
- **HTTP2 (H2) Server Push**
  - When we request a page, usually that page is fetched and during parsing, all the critical resources that are needed are fetched again and loaded. We can reduce this time taken for fetching
  - Preloading solved a part of the problem - but it reduces the time only for resources that will be required later (lazy loaded). What about critical resources required on load - i.e when you want to paint for the first time?
  - HTTP2 has something known as server push (***New***) - it automatically sends certain additional resources (configured on server side - like your styles & scripts) whenever you request the page itself. So, you don't have to make additional requests for critical resources again. The initial page load time decreases (yay!)
    - Drawbacks of server push: It is ***not cache aware*** and there is ***no resource prioritization***! If the browser has a cache of the same resource that the H2 server intends to push then the server still pushes that resource because it is unaware of what is in the cache - and the browser *has* to accept it, no other go. Also, resources that are pushed are done randomly, not in a prioritized manner. Because of these two drawbacks, data costs can shoot up tremendously!
    - Solution: H2 Server Push  + SW

- **HTTP2 Server Push + Service Worker = Best Combo**
  - Since service workers act like a proxy to the client, we can intercept all resource requests made to the server. Once we have all the resources on first load, we can serve from the cache on second load without even making a request to the server so that it does not push all other resources as well
  - *First load*: Request fetches the page and all other resources that are critical (probably push by the H2 server). Service worker script is one of the resources downloaded and it has not been registered just yet!
  - *Second load*: Service worker has been registered, it intercepts requests and serves data from cache without even hitting the server. Even the critical resources that H2 automatically pushed are served from the cache - and the server does not get to push them again because we don't even send the request to it

**Network Summary**

1. **Preload** is good for moving the start download time of an asset closer to the initial request
2. **H2 Server Push** is good for cutting out one full round trip time for (critical) resources requested by the page (during parsing). It gets better data cost wise & request service time wise when coupled with a service worker!

Network latency optimisation improves **Time to First Paint**

**Improving Time to Interactive**

- Once the TTFP is resolved, the remainder of your problem of getting the user interactive with page deals with Javascript. ***Parsing & executing Javascript*** is going to ***block your render*** and hence, make your page less (non) interactive during that time!
- The size of javascript that is being shipped is increasing every day! (Started from KBs, now some apps are shipping MBs of JS). If you add frameworks + store management + code from tooling (webpack), the size increases heavily
  - How do we *reduce* the parse time? Ans: ***Reducing the size of code that is being parsed***. Ex: What if we have JS that displays a graph but the graph is not visible on load, instead it appears on scrolling. 
  - We can ship certain JS that is downloaded but *not parsed*! There are *two* manual methods to do this:
    - **`<script type="inert" src="...">`**: If the `type` of the script specified is an *invalid* type (like "inert") then the script id downloaded but not parsed & executed!
    - **`<script id="..."> /* ( .. code .. ) */ </script>`**: Ship code that is commented out. Again, this is downloaded but not parsed/executed after downloading
    - The above two methods help you avoid that parse cost: You can manually decide when to parse that piece of code. The control lies over the developer. So, we can ship code on page load but parse it later, improving the render time (time to interactive)
  - Automatic ways to split code and parse later (frameworks & tools):
    - [Angular lazy module loading](https://angular.io/guide/ngmodules#!#lazy-load)
    - [Webpack aggressive splitting plugin - `require.ensure()`](https://github.com/webpack/webpack/tree/master/examples/http2-aggressive-splitting)

**Summary of Time to Interactive**

Ship the ***smallest amount of Javascript*** as possible 

**Summary of everything**

Test on ***real devices*** on ***mobile networks***
