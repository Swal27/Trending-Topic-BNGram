export const isServiceWorkerRegistered = () => {
    return (
        'serviceWorker' in navigator &&
        navigator.serviceWorker.controller !== null
    );
};

export const registerServiceWorker = () => {
    return navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
};