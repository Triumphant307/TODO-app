// const CACHE_NAME = "todo-app-v1"
// const urlsToCache = [
//     "./",
//     "./index.html",
//     "./style.css",
//     "./script.js",
//     "./icon.png",
//     "./manifest.json",
//     "https://fonts.googleapis.com/icon?family=Material+Icons"
// ]

// self.addEventListener("install" , (event) =>{
//     console.log("Service worker Installed");
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//         .then(cache => {
//             console.log("Caching files....");
//             return cache.addAll(urlsToCache);
//         })
//     )
    
// })

// self.addEventListener("fetch" , (event) => {
//     event.respondWith(
//         caches.match(event.request)
//         .then(response => {
//             return response || fetch(event.request)
//         })
//     )
// })

// self.addEventListener("activate" , (event) => {
//     console.log("Service Worker Activated")
//     event.waitUntil(
//         caches.keys().then(cacheNames =>{
//             return Promise.all(
//                 cacheNames.map(cache => {
//                     if (cache !== CACHE_NAME) {
//                         console.log("Deleting Old Cache...")
//                         return caches.delete(cache)
//                     }
//                 })
//             )
//         })
//     )
// })

const CACHE_NAME = "todo-app-v1"
const urlsToCache = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./icon.png",
    "./manifest.json",
    "https://fonts.googleapis.com/icon?family=Material+Icons"
]

self.addEventListener("install", (event) => {
    console.log("Service Worker Installed")
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log("Caching files....")
            return cache.addAll(urlsToCache)
        })
        .catch(error => {
            console.error("Failed to cache files during installation:", error)
        })
    )
})

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request)
                .then(fetchedResponse => {
                    // Optional: Cache the new response for future requests
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchedResponse.clone())
                        return fetchedResponse
                    })
                })
        })
        .catch(error => {
            console.error("Fetch failed; returning offline page:", error)
            // You can return an offline page if fetch fails
            return caches.match("./offline.html")
        })
    )
})

self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated")
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting Old Cache...")
                        return caches.delete(cache)
                    }
                })
            )
        })
        .catch(error => {
            console.error("Failed to clean up caches:", error)
        })
    )
})
