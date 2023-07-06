import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
const ProgressPath = path.join(__dirname, '/Data', 'ProgressList.json');

export const ProgressDelete = (id) => {
    fs.readFile(ProgressPath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        try {
            const jsonContent = JSON.parse(data);
            delete jsonContent[id]

            fs.writeFile(ProgressPath, JSON.stringify(jsonContent, null, 2), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(`${id} has deleted from progress`);
            })
        } catch (err) {
            console.log(err);
        }
    })
}

export const ProgressCreateUpdate = (id, value) => {
    fs.readFile(ProgressPath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        try {
            const jsonContent = JSON.parse(data);
            jsonContent[id] = value;

            fs.writeFile(ProgressPath, JSON.stringify(jsonContent, null, 2), (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
            })
        } catch (err) {
            console.log(err);
        }
    })
}

export const ProgressRead = (id) => new Promise((resolve, reject) => {
    fs.readFile(ProgressPath, 'utf8', (err, data) => {
        if (err) {
            reject(err)
            return;
        }
        try {
            const jsonContent = JSON.parse(data);
            const value = jsonContent[id];
            resolve(value)

        } catch (err) {
            reject(err)
        }
    })
})
