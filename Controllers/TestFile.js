import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
export const testo = (req, res, next) => {
    const command = 'python Python/hello.py';

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).json({
            ok: true,
            py: stdout
        });
    });
}

export const testo2 = (req, res, next) => {
    const img = path.join(__dirname, '/Python/Images', req.params.file);
    if (fs.existsSync(img)) {
        res.sendFile(img);
    } else {
        res.send('Image Not Found')
    }
}


// const str = "hello world\r\nwaaa\r\ncyaa\r\n";

// // Memecah string menjadi array berdasarkan karakter pemisah '\r\n'
// const arr = str.split('\r\n');

// // Mencari kata 'cyaa' dalam array
// const targetWord = 'cyaa';
// const filteredArray = arr.filter(item => item === targetWord);

// // Mengambil elemen pertama dari array hasil filter (kata 'cyaa')
// const result = filteredArray[0];

// console.log(result); // Output: 'cyaa'
