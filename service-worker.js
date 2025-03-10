
const CACHE_NAME = "todo-app-cache-v1";
const urlsToCache = [
    "./",
    "./index.html",
    "./style.css",
    "./todo.js",
    "./assets/pic/appicon.png",
    "./manifest.json",
    "https://fonts.googleapis.com/icon?family=Material+Icons"
 ];


 self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
       .then(cache => {
         console.log("Caching files.....")
         return cache.addAll(urlsToCache);
       })
    )
 })

 self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchRes => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            });
        }).catch(() => caches.match("./index.html")) // Fallback for offline
    );
});

self.addEventListener("activate" , event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== CACHE_NAME){
                        console.log("Deleting old cache....");
                        return caches.delete(cache);
                        
                    }
                })
            )
        })
    )
})

self.addEventListener("push" , event => {
    const options = {
        body: "New Todo Added",
        icon: "./assets/pic/appicon.png",
        badge: "./assets/pic/appicon.png",
        vibrate: [200 , 100 ,200]
    }
    event.waitUntil(
        self.registration.showNotification("To-Do App", options)
    )
})