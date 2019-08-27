var CACHE_STATIC_NAME = 'seyastatic-v1';
var CACHE_DYNAMIC_NAME = 'seyadynamic-v1';
const baseUrl = 'https://mayaprojects.net/seyademo/';

var STATIC_FILES = [
    '/',
    '/assets/js/web/pwa.js'
];

self.addEventListener('install' , function(event){
	console.log('[Service Worker] instaling service worker...' , event);
	event.waitUntil(
		caches.open(CACHE_STATIC_NAME)
			.then(function(cache){
				console.log('[Service Worker] Prechacheing app shell');
				cache.addAll(STATIC_FILES);
			})
	)
});

self.addEventListener('activate' , function(event){
	//console.log('[Service Worker] Activating service worker...' , event);
	event.waitUntil(
		caches.keys()
			.then(function(keyList){
				return Promise.all(keyList.map(function(key){
					if( key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME ){
						console.log('[Service Worker] Remove old cache.' , key);
						return caches.delete(key);
					}
				}));
			})
	);
	return self.clients.claim();
});

function isInArray(string , array){
	for (var i = 0; i < array.length; i++) {
		if( array[i] === string ){
			return true;
		}
	}
	return false;
}

self.addEventListener('fetch' , function(event){

	// if( isInArray(event.request.url , STATIC_FILES) ){
	// 	event.respondWith(
	// 		caches.match(event.request)
	// 	);
	// }else{
	// 	event.respondWith(
	// 		caches.match(event.request)
	// 			.then(function(response){
	// 				if (response) {
	// 					return response;
	// 				}else{
	// 					return fetch(event.request)
	// 						.then(function(res){
	// 							return caches.open(CACHE_DYNAMIC_NAME)
	// 								.then(function(cache){
	// 									cache.put(event.request.url , res.clone());
	// 									return res;
	// 								})
	// 						})
	// 						.catch(function(err){
	// 							return caches.open(CACHE_STATIC_NAME)
	// 								.then(function(cache){
	// 									if( event.request.headers.get('accept').includes('text/html') ){
	// 										return cache.match('/offline/');
	// 									}										
	// 								});
	// 						});
	// 				}
	// 			})
	// 	);
	// }
	
});

self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
  
    console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    console.log('action' , action);
  
    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('http://www.example.com');
        notification.close();
    }
});
  
self.addEventListener('push', function(event) {
    console.info('Event' , event);
    console.info('text' , event.data.text());
    var title = 'Breaking News';
    var body = {
        'body': 'Click to see the latest breaking news',
        'tag': 'pwa',
        'icon': './images/48x48.png'
    };
    event.waitUntil(
        self.registration.showNotification(title, body)
    );
});