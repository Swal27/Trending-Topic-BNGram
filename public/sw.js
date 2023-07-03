// let myself = this;
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'fetchProcess') {
        fetchWithTimeout(event.data.data.url, 180000, event.data.data.headerMethodBody)
            .then((data) => {
                if (data.ok == true) {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ action: 'ProcessFetched', data: data });
                        });
                    });
                }
            })
            .catch(error => {
                console.log(error);
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'actionFailed', data: error });
                    });
                });
            });
        // fetchDataInBackground(event.data.data)
        //     .then((data) => {
        //         // console.log(data);
        //         if (data.ok == true) {
        //             self.clients.matchAll().then((clients) => {
        //                 clients.forEach((client) => {
        //                     client.postMessage({ action: 'ProcessFetched', data: data });
        //                 });
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         self.clients.matchAll().then((clients) => {
        //             clients.forEach((client) => {
        //                 client.postMessage({ action: 'actionFailed', data: error });
        //             });
        //         });
        //     });
    }
    if (event.data && event.data.action === 'fetchPull') {
        fetchDataInBackground(event.data.data)
            .then((data) => {
                // console.log(data);
                if (data.ok == true) {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ action: 'PullFetched', data: data });
                        });
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'actionFailed', data: error });
                    });
                });
            });
    }
    if (event.data && event.data.action === 'fetchPreprocess') {
        fetchDataInBackground(event.data.data)
            .then((data) => {
                // console.log(data);
                if (data.ok == true) {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ action: 'PreprocessFetched', data: data });
                        });
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'actionFailed', data: error });
                    });
                });
            });
    }
    if (event.data && event.data.action === 'fetchVisual') {
        fetchWithTimeout(event.data.data.url, 180000, event.data.data.headerMethodBody)
            .then((data) => {
                if (data.ok == true) {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ action: 'VisualFetched', data: data });
                        });
                    });
                }
            })
            .catch(error => {
                console.log(error);
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ action: 'actionFailed', data: error });
                    });
                });
            });
        // fetchDataInBackground(event.data.data)
        //     .then((data) => {
        //         // console.log(data);
        //         if (data.ok == true) {
        //             self.clients.matchAll().then((clients) => {
        //                 clients.forEach((client) => {
        //                     client.postMessage({ action: 'VisualFetched', data: data });
        //                 });
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         self.clients.matchAll().then((clients) => {
        //             clients.forEach((client) => {
        //                 client.postMessage({ action: 'actionFailed', data: error });
        //             });
        //         });
        //     });
    }
});

const fetchDataInBackground = (data) => {
    console.log(data);
    return fetch(data.url, data.headerMethodBody)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log('Data fetched:', data);
            return data;
        })
        .catch(error => {
            // console.error('Error fetching data:', error);
            throw new Error('Error fetching data:', error);
        });
}

function fetchWithTimeout(url, timeout, options) {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error('Request timed out'));
        }, timeout);

        fetch(url, { signal, ...options })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((result) => {
                console.log('awaaaa');
                clearTimeout(timeoutId);
                resolve(result);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
}