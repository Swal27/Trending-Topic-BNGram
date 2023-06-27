import result_table from "../Models/result_table.js";
import HeaderCheck from "../utils/headerCheck.js";
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const __dirname = path.resolve();

export const ResultExecuteProcess = (req, res, next) => {
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


export const getAllResult = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        result_table.findAll().then((result) => {
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
            });
        });
    }
}

export const getImageResult = (req, res, next) => {
    if (req.params.file !== null) {
        const img = path.join(__dirname, '/Python/Images', req.params.file);
        if (fs.existsSync(img)) {
            res.sendFile(img);
        } else {
            res.send('Image Not Found');
        }
    } else {
        res.send('Image Not Found');
    }
}

export const ResdeleteAllData = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        if (req.body.filename !== null) {
            result_table.destroy().then(() => {
                fs.unlink(`./Python/Images/${req.body.file}`, (error) => {
                    if (error) {
                        res.status(500).json({
                            ok: false,
                            code: 500,
                            data: false,
                            message: 'Failed To Delete File',
                            error: error
                        });
                        return;
                    }
                    res.status(200).json({
                        ok: true,
                        code: 200,
                        data: false,
                    });
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
        } else {
            res.send('File Not Found');
        }
    }
}