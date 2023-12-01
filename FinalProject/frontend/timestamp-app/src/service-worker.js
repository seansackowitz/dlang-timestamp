/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

function log(...data) {
  console.log("SWv2.0", ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = "timestamp-static-1.0";

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.

self.addEventListener('install', event => {
  log('install', event);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        // '/offline',
        //CSS
        // '/css/base.css',
        // '/css/error.css',
        // '/css/home.css',
        // '/css/login.css',
        // '/css/offline.css',
        // '/css/park.css',
        //Images
        // '/img/ncparkmap.png',
        // '/img/park.jpg',
        // '/favicon.ico',
        '/images/TimeStamp2.png',
        //Scripts
        // '/js/APIClient.js',
        // '/js/common.js',
        // '/js/home.js',
        // '/js/HTTPClient.js',
        // '/js/login.js',
        // '/js/park.js',
        '/page/LoginPage.jsx',
        '/page/ProfilePage.jsx',
        '/page/Homepage.jsx',
        '/page/HoursRecord.jsx',
        '/page/BusinessPaymentPage.jsx',
        '/page/EmployerHomepage.jsx',
        //External Resources
        // 'https://unpkg.com/leaflet@1.9.1/dist/leaflet.css',
        // 'https://unpkg.com/leaflet@1.9.1/dist/leaflet.js',
        // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'
      ]);
    })
  );
});

// Remove all previous caches when the new service worker is activated
self.addEventListener('activate', (event) => {
  log('activate', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('timestamp-') && cacheName != STATIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  // const cacheWhitelist = ['pages-cache', 'runtime-cache'];
  // event.waitUntil(
  //   caches.keys().then((cacheNames) => {
  //     return Promise.all(
  //       cacheNames.map((cacheName) => {
  //         if (cacheWhitelist.indexOf(cacheName) === -1) {
  //           return caches.delete(cacheName);
  //         }
  //       }
  //       ));
  //   }
  //   ).then(() => self.clients.claim())
  // );
});

self.addEventListener('fetch', (event) => {
  var requestUrl = new URL(event.request.url);
  //Treat API calls (to our API) differently
  if (requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api/')) {
    if (event.request.method === "GET") {
      try {
        if (navigator.onLine) {
          // Attempt to fetch and cache the response
          event.respondWith(
            fetchAndCache(event.request)
          );
        }
        else {
          // Only respond with cache when calling GET API requests if an error occurs (offline)
          event.respondWith(
            cacheFirst(event.request)
          );
        }
      }
      catch (error) {
        // Only respond with cache when calling GET API requests if an error occurs (offline)
        event.respondWith(
          cacheFirst(event.request)
        );
      }
    }
    // If the user is logging out, then log them out and remove all API cache
    else if (event.request.method === "POST" && requestUrl.pathname.startsWith('/api/logout')) {
      caches.open(STATIC_CACHE_NAME).then(cache => {
        cache.keys().then((cacheRequests) => {
          console.log("CACHE NAME IS", cacheRequests);
          cacheRequests.filter(cacheRequest => cacheRequest.url.includes('/api/')).map((cacheName) => cache.delete(cacheName));
        });
      });
    }
    // If the user is logging in and the current user cache exists, then remove user cache and all API cache
    else if (event.request.method === "POST" && requestUrl.pathname.startsWith('/api/login') && caches.has('/api/login/users/current')) {
      caches.open(STATIC_CACHE_NAME).then(cache => {
        cache.keys().then((cacheRequests) => {
          console.log("CACHE NAME IS", cacheRequests);
          cacheRequests.filter(cacheRequest => cacheRequest.url.includes('/api/')).map((cacheName) => cache.delete(cacheName));
        });
      });
    }
  }
  // If the user is on the login page and the previous user cache exists, get rid of the current user cache
  // else if (event.request.method === "GET" && requestUrl.pathname.startsWith('/login') && caches.has('/api/login/users/current')) {
  //   caches.open(STATIC_CACHE_NAME).then(cache => {
  //     cache.delete('/api/login/users/current');
  //   });
  // }
  else {
    //If we are here, this was not a call to our API
    event.respondWith(
      cacheFirst(event.request)
    );
  }
  // event.respondWith(
  //   caches.match(event.request).then((cachedResponse) => {
  //     if (cachedResponse) {
  //       return cachedResponse;
  //     }

  //     return caches.open('pages-cache').then((cache) => {
  //       return fetch(event.request).then((response) => {
  //         return cache.put(event.request, response.clone()).then(() => {
  //           return response;
  //         });
  //       });
  //     });
  //   })
  // );
});


function cacheFirst(request) {
  return caches.match(request)
    .then(response => {
      //Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch(error => {
      return caches.match('/offline');
    })
}



function fetchAndCache(request) {
  return fetch(request).then(response => {
    var requestUrl = new URL(request.url);
    //Cache everything except login
    if (response.ok /*&& !requestUrl.pathname.startsWith('/login')*/) {
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      });
    }
    return response.clone();
  }).catch(() => {
    return new Error("Fetch doesn't work. Potentially offline.");
  });
}
