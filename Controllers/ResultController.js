import result_table from "../Models/result_table.js";
import HeaderCheck from "../utils/headerCheck.js";
import path from 'path';
import fs from 'fs';
import { exec, spawn } from 'child_process';
import sequelizes from "../config/db_config.js";
import rawtweet from "../Models/rawtweet.js";
import { Op } from "sequelize";
import { nanoid } from "nanoid";
import { ProgressCreateUpdate, ProgressDelete, ProgressRead } from "../utils/progress.js";

const __dirname = path.resolve();

const clusterPath = path.join(__dirname, '/Python/dendogram fig', 'clusters.json');
const resultPath = path.join(__dirname, '/Python/dendogram fig', 'result.json');

export const ResultExecuteProcess = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        const idProgress = nanoid(8);
        const executer = () => new Promise((resolve, reject) => {
            const command = 'python';
            result_table.findAll()
                .then((result) => {
                    res.status(200).json({
                        ok: true,
                        code: 200,
                        data: idProgress
                    });
                    ProgressCreateUpdate(idProgress, 1);
                    if (result != null && result != '') {
                        console.log('Table not empty');
                        result_table.destroy({
                            where: {},
                            truncate: true
                        })
                            .then(() => {

                                const process = spawn(command, ['Python/bigram.py']);
                                process.stdout.on('data', (data) => {
                                    // console.log(data);
                                });

                                process.on('close', (code) => {
                                    console.log(code);
                                    if (code == 0) {
                                        resolve(code);
                                    }
                                });

                                process.stderr.on('data', (data) => {
                                    reject(new Error(data.toString()));
                                });

                                process.on('error', (error) => {
                                    reject(error);
                                });
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    } else {
                        console.log('Table empty');
                        const process = spawn(command, ['Python/bigram.py']);

                        process.stdout.on('data', (data) => {
                            // console.log(data);
                        });

                        process.on('close', (code) => {
                            console.log(code);
                            if (code == 0) {
                                resolve(code);

                            }
                        });

                        process.stderr.on('data', (data) => {
                            reject(new Error(data.toString()));
                        });

                        process.on('error', (error) => {
                            reject(error);
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

        executer()
            .then((code) => {
                ProgressCreateUpdate(idProgress, code)
            })
            .catch((error) => {
                console.log(error);
                ProgressCreateUpdate(idProgress, 2);
            });

    }
}

export const ResultExecuteCluster = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        const command = 'python';
        const idProgress = nanoid(8);
        res.status(200).json({
            ok: true,
            code: 200,
            data: idProgress
        });
        ProgressCreateUpdate(idProgress, 1);
        const executer1 = () => new Promise((resolve, reject) => {
            const process = spawn(command, ['Python/clustering.py']);

            process.stdout.on('data', (data) => {
                resolve(data.toString());
            });

            process.stderr.on('data', (data) => {
                reject(new Error(data.toString()));
            });

            process.on('error', (error) => {
                reject(error);
            });
        });

        const executer2 = () => new Promise((resolve, reject) => {
            const process = spawn(command, ['Python/ranking.py']);

            process.stdout.on('data', (data) => {
                resolve(data.toString());
            });

            process.stderr.on('data', (data) => {
                reject(new Error(data.toString()));
            });

            process.on('error', (error) => {
                reject(error);
            });
        });

        executer1().then(() => {
            executer2().then(() => {
                ClusterChanger(idProgress).then(() => {
                    ResultChanger(idProgress).then(() => {
                        ProgressCreateUpdate(idProgress, 0);
                    }).catch((error) => {
                        console.log(error);
                        ProgressCreateUpdate(idProgress, 2);
                    })
                }).catch((error) => {
                    console.log(error);
                    ProgressCreateUpdate(idProgress, 2);
                })
            }).catch((error) => {
                console.log(error);
                ProgressCreateUpdate(idProgress, 2);
            })
        }).catch((error) => {
            console.log(error);
            ProgressCreateUpdate(idProgress, 2);
        })
    }
};

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

export const ClusterJson = (req, res, next) => {
    if (HeaderCheck(req, res)) {
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

                //
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
                                topCluster: resultJson["Cluster Rankings"].map(clusterRank => clusterRank.Cluster.split(' ')[1]).join(',')
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
        if (HeaderCheck(req, res)) {
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
}

export const isProcessed = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        result_table.count({
            col: 'id',
            distinct: true
        }).then((result) => {
            if (result > 0) {
                res.status(200).json({
                    ok: true,
                    code: 200,
                    data: result
                })
            } else {
                res.status(200).json({
                    ok: false,
                    code: 200,
                    data: false
                })
            }
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

const ResultChanger = (id) => new Promise((resolve, reject) => {
    fs.readFile(resultPath, 'utf8', (err, resultdata) => {
        if (err) {
            reject(err);
            return;
        }

        try {
            const parsedJson = JSON.parse(resultdata);
            const promises = [];

            for (const clusterRanking of parsedJson['Cluster Rankings']) {
                for (const bigram of clusterRanking.Bigrams) {
                    const promise = rawtweet.findOne({
                        attributes: ['text_raw'],
                        where: {
                            text_raw: {
                                [Op.like]: `%${bigram.Bigram}%`
                            }
                        }
                    })
                        .then(result => {
                            bigram['raw_tweet'] = result ? result.dataValues.text_raw : '';
                        })
                        .catch(error => {
                            reject(error);
                            throw error;
                        });

                    promises.push(promise);
                }
            }

            Promise.all(promises)
                .then(() => {
                    parsedJson['id'] = id;
                    const modifiedJson = JSON.stringify(parsedJson, null, 2);
                    fs.writeFile(resultPath, modifiedJson, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            fs.readFile(resultPath, 'utf8', (err, resultS) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(true);
                                }
                            });
                        }
                    });
                })
                .catch(error => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
});


const ClusterChanger = (id) => new Promise((resolve, rejects) => {
    fs.readFile(clusterPath, 'utf8', (err, resultdata) => {
        if (err) {
            rejects(err)
            return;
        }
        const parsedJson = JSON.parse(resultdata);
        parsedJson['id'] = id;
        const modifiedJson = JSON.stringify(parsedJson, null, 2);

        fs.writeFile(clusterPath, modifiedJson, (err) => {
            if (err) {
                rejects(err);
                return
            }
            resolve(true)
        })
    });
});
