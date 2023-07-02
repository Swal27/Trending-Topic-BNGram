// let myself = this;
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'fetchProcess') {
        fetchDataInBackground(event.data.data)
            .then((data) => {
                // console.log(data);
                if (data.ok == true) {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ action: 'ProcessFetched', data: data });
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
        fetchDataInBackground(event.data.data)
            .then((data) => {
                // console.log(data);
                if (data.ok == true) {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ action: 'VisualFetched', data: data });
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
});

const fetchDataInBackground = (data) => {
    return fetch(data.url, data.headerMethod)
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