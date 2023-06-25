// let myself = this;
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'fetchData') {
        fetchDataInBackground()
            .then((data) => {
                console.log(data);
                if (data.ok == true) {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({ action: 'dataFetched', data: data });
                        });
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

const fetchDataInBackground = () => {
    return fetch('http://localhost:3000/test')
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