import rawtweet from '../Models/rawtweet.js'
import HeaderCheck from '../utils/headerCheck.js'
import { exec } from 'child_process';

export const TweetExecuteProcess = (req, res, next) => {
    if (HeaderCheck(req, res)) {
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
                code: 200,
                data: false
            });
        });
    }
}

export const getAllTweet = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        rawtweet.findAll().then((result) => {
            res.status(200).json({
                ok: true,
                code: 200,
                data: result,
            });
        }).catch((error) => {
            res.status(500).json({
                ok: false,
                code: 500,
                data: false,
                message: 'Internal Server Error',
                error: error
            })
        })
    }
}

export const TweetdeleteAllData = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        rawtweet.destroy().then(() => {
            res.status(200).json({
                ok: true,
                code: 200,
                data: false,
            });
        }).catch((error) => {
            res.status(500).json({
                ok: false,
                code: 500,
                data: false,
                message: 'Internal Server Error',
                error: error
            });
        });
    }
}