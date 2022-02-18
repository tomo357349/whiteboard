// serve no-cache: http-serve -c-1
var appcachename = 'v1';
var appcachefiles = [
	'./',
	'./index.html',
	'./manifest.json',
	'./assets/favicon.ico',
	'./assets/css/style.css',
	'./assets/icon/icon-72.png',
	'./assets/icon/icon-144.png',
	'./assets/js/jquery.js',
	'./assets/js/paper.js',
	'./assets/js/scripts.js',
];
self.addEventListener('install', function (event) {
	var swglobal = event.target;
	console.log('install:', swglobal.appcachename);
	// console.log(event);
	event.waitUntil(caches.open(appcachename).then(function(cache) {
		var res = cache.addAll(appcachefiles);
		// self.skipWaiting(); // always activate updated SW immediately
		return res;
	}));
});
self.addEventListener('message', function (event) {
	console.log('message:');
	// console.log(event.data, event);
});
self.addEventListener('activate', function (event) {
	var swglobal = event.target;
	console.log('activate:', swglobal.appcachename);
	// console.log(event);
	event.waitUntil(caches.keys().then(function (keylist) {
		console.log(keylist);
		return Promise.all(keylist.map(function (key) {
			if (key !== appcachename) {
				console.log('delete cache:' + key);
				return caches.delete(key);
			}
		}));
	}));
});
self.addEventListener('fetch', function(event) {
	console.log('fetch:', event.request.url);
	// console.log(event);
	event.respondWith(caches.match(event.request).then(function(response) {
		console.log('response in cache:', response ? response.status: undefined);
		return response || fetch(event.request).then(function (nextresponse) {
			console.log('fetch next:', response ? response.status: undefined);
			return nextresponse;
			// return caches.open(appcachename).then(function (cache) {
			//   cache.put(event.request, nextresponse.clone());
			//   return nextresponse;
			// });
		});
	}));
});
