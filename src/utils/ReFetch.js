const RefetchDataInBackground = (data, id, time) => new Promise((resolve, reject) => {
    const maxDuration = 4 * 60 * 1000;
    const interval = time * 1000;
    let intervalCount = 0;

    const fetchData = () => {
        fetch(`${data.url2}/${id}`, data.headerMethodBody2)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                if (responseData.ok === true) {
                    resolve(responseData);
                } else {
                    intervalCount++;
                    if (intervalCount * interval <= maxDuration) {
                        setTimeout(fetchData, interval);
                    } else {
                        reject(new Error('Exceeded maximum duration'));
                    }
                }
            })
            .catch(error => {
                reject(error);
            });
    };

    fetchData();
});

export default RefetchDataInBackground;