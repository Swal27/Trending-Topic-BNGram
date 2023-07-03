import result_table from "../Models/result_table.js";
import HeaderCheck from "../utils/headerCheck.js";
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import sequelizes from "../config/db_config.js";

const __dirname = path.resolve();

export const ResultExecuteProcess = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        const executer = () => new Promise((resolve, reject) => {
            result_table.findAll().then((result) => {
                if ((result != null) || (result != '')) {
                    console.log('Table not empty');
                    result_table.destroy({
                        where: {},
                        truncate: true
                    }).then(() => {
                        const command = 'python Python/bigram.py';

                        exec(command, (error, stdout, stderr) => {
                            if (error) {
                                reject(error);
                                return;
                            }
                            if (stderr) {
                                reject(stderr);
                                return;
                            }
                            if (stdout) {
                                resolve(stdout);
                            }
                        })
                    }).catch((error) => {
                        reject(error)
                    })
                } else {
                    console.log('Table empty');
                    const command = 'python Python/bigram.py';

                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            reject(error)
                            return;
                        }
                        if (stderr) {
                            console.error(`stderr: ${stderr}`);
                            reject(error);
                            return;
                        }
                        if (stdout) {
                            resolve(stdout);
                        }
                    });
                }
            }).catch((error) => {
                reject(error);
            })
        });
        executer().then((out) => {
            console.log('asdasdadasd');
            res.status(200).json({
                ok: true,
                code: 200,
                data: false
            });
        }).catch((error) => {
            res.status(500).json({
                ok: false,
                code: 500,
                data: false,
                message: 'Internal Server Error 0',
                error: error
            })
        })
    }
}

export const ResultExecuteCluster = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        const command = 'python Python/clustering.py';

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                res.status(500).json({
                    ok: false,
                    code: 500,
                    data: false,
                    message: 'Internal Server Error 0',
                    error: error.message
                })
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                res.status(500).json({
                    ok: false,
                    code: 500,
                    data: false,
                    message: 'Internal Server Error 1',
                    error: stderr
                })
                return;
            }
            console.log(`stdout: ${stdout}`);
            // res.status(200).json({
            //     ok: true,
            //     code: 200,
            //     data: false
            // });
            const command2 = 'python Python/ranking.py';
            await exec(command2, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    res.status(500).json({
                        ok: false,
                        code: 500,
                        data: false,
                        message: 'Internal Server Error 2',
                        error: error.message
                    })
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    res.status(500).json({
                        ok: false,
                        code: 500,
                        data: false,
                        message: 'Internal Server Error 3',
                        error: stderr
                    })
                    return;
                }
                console.log(`stdout: ${stdout}`);
                await res.status(200).json({
                    ok: true,
                    code: 200,
                    data: false
                });
            });
        });
    }
}


export const getAllResult = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        result_table.findAll({
            attributes: [
                [sequelizes.literal('row_number() over (order by id)'), 'row_number'],
                'bigram', 'df', 'idf', 'dfidf'
            ]
        }).then((result) => {
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
    if (req.params.file != null) {
        const img = path.join(__dirname, '/Python/dendogram fig', req.params.file);
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

export const ClusterJson = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        const clusterPath = path.join(__dirname, '/Python/dendogram fig', 'clusters.json');
        fs.readFile(clusterPath, 'utf8', (err, clusterdata) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).json({
                    ok: false,
                    code: 500,
                    data: false,
                    message: 'Internal Server Error',
                    error: err
                });
                return;
            }

            try {
                const clusterJson = JSON.parse(clusterdata);
                const resultPath = path.join(__dirname, '/Python/dendogram fig', 'result.json');
                fs.readFile(resultPath, 'utf8', (err, resultdata) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        res.status(500).json({
                            ok: false,
                            code: 500,
                            data: false,
                            message: 'Internal Server Error',
                            error: err
                        });
                        return;
                    }

                    try {
                        const resultJson = JSON.parse(resultdata);
                        res.status(200).json({
                            ok: true,
                            code: 200,
                            data: {
                                totalCluster: Object.keys(clusterJson).length,
                                topCluster: resultJson['Cluster Ranking'].Cluster
                            }
                        });

                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        res.status(500).json({
                            ok: false,
                            code: 500,
                            data: false,
                            message: 'Internal Server Error',
                            error: error
                        });
                    }
                });

            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500).json({
                    ok: false,
                    code: 500,
                    data: false,
                    message: 'Internal Server Error',
                    error: error
                });
            }
        });
    }
}

export const ResultJson = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        const resultPath = path.join(__dirname, '/Python/dendogram fig', 'result.json');
        fs.readFile(resultPath, 'utf8', (err, resultdata) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).json({
                    ok: false,
                    code: 500,
                    data: false,
                    message: 'Internal Server Error',
                    error: err
                });
                return;
            }

            try {
                res.status(200).json({
                    ok: true,
                    code: 200,
                    data: JSON.parse(resultdata)
                });

            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500).json({
                    ok: false,
                    code: 500,
                    data: false,
                    message: 'Internal Server Error',
                    error: error
                });
            }
        });
    }
}