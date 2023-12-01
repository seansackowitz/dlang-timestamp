import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorkerRegistration';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker
//         .register('./serviceWorker.js')
//         .then(registration => {
//           console.log('Service worker registered:', registration);
//         })
//         .catch(error => {
//           console.log('Service worker registration failed:', error);
//         });
//     });
//   }  

// function registerServiceWorker() {
//     if (!navigator.serviceWorker) { // Are SWs supported?
//       return;
//     }
  
//     navigator.serviceWorker.register('/serviceWorker.js')
//       .then(registration => {
//         if (!navigator.serviceWorker.controller) {
//           //Our page is not yet controlled by anything. It's a new SW
//           return;
//         }
  
//         if (registration.installing) {
//           console.log('Service worker installing');
//         } else if (registration.waiting) {
//           console.log('Service worker installed, but waiting');
//           newServiceWorkerReady(registration.waiting);
//         } else if (registration.active) {
//           console.log('Service worker active');
//         }
  
//         registration.addEventListener('updatefound', () => {
//           console.log("SW update found", registration, navigator.serviceWorker.controller);
//           newServiceWorkerReady(registration.installing);
//         });
//       })
//       .catch(error => {
//         console.error(`Registration failed with error: ${error}`);
//       });
  
//     navigator.serviceWorker.addEventListener('message', event => {
//       console.log('SW message', event.data);
//     })
  
//     // Ensure refresh is only called once.
//     // This works around a bug in "force update on reload" in dev tools.
//     let refreshing = false;
//     navigator.serviceWorker.addEventListener('controllerchange', () => {
//       if(refreshing) return;
//       window.location.reload();
//       refreshing = true;
//     });
  
//   };
  
//   registerServiceWorker();
  
  
//   //This method is used to notify the user of a new version
//   function newServiceWorkerReady(worker) {
//     const popup =  document.createElement('div');
//     popup.className = "popup";
//     popup.innerHTML = '<div>New Version Available</div>';
  
//     const buttonOk = document.createElement('button');
//     buttonOk.innerHTML = 'Update';
//     buttonOk.addEventListener('click', e => {
//       worker.postMessage({action: 'skipWaiting'});
//     });
//     popup.appendChild(buttonOk);
  
//     const buttonCancel = document.createElement('button');
//     buttonCancel.innerHTML = 'Dismiss';
//     buttonCancel.addEventListener('click', e => {
//       document.body.removeChild(popup);
//     });
//     popup.appendChild(buttonCancel);
  
//     document.body.appendChild(popup);
//   }  

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// ServiceWorkerRegistration.register('./serviceWorkerRegistration.js');
console.log("BEFORE REGISTERING SERVICE WORKER");
serviceWorker.register();
console.log("AFTER REGISTERING SERVICE WORKER");
