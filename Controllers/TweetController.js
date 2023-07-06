import rawtweet from '../Models/rawtweet.js'
import sequelizes from '../config/db_config.js';
import HeaderCheck from '../utils/headerCheck.js'
import { exec } from 'child_process';
import { ProgressCreateUpdate, ProgressDelete, ProgressRead } from '../utils/progress.js';
import { nanoid } from 'nanoid';

export const TweetExecuteProcess = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        if (req.body.fData != null) {
            rawtweet.findAll().then((result) => {
                if ((result != null) || (result != '')) {
                    console.log('Table not empty');
                    rawtweet.destroy({
                        where: {},
                        truncate: true
                    }).then(() => {
                        //add here
                        const command = `python Python/tweet.py ${req.body.fData}`;
                        exec(command, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Error: ${error.message}`);
                                res.status(500).json({
                                    ok: false,
                                    code: 500,
                                    data: false,
                                    message: 'Internal Server Error 0',
                                    error: error.message
                                });
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
                                });
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                            res.status(200).json({
                                ok: true,
                                code: 200,
                                data: false
                            });
                        });
                    }).catch((error) => {
                        res.status(500).json({
                            ok: false,
                            code: 500,
                            data: false,
                            message: 'Internal Server Error 2',
                            error: error
                        });
                    });
                } else {
                    console.log('Table empty');
                    const command = `python Python/tweet.py ${req.body.fData}`;
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error: ${error.message}`);
                            res.status(500).json({
                                ok: false,
                                code: 500,
                                data: false,
                                message: 'Internal Server Error 3',
                                error: error.message
                            });
                            return;
                        }
                        if (stderr) {
                            console.error(`stderr: ${stderr}`);
                            res.status(500).json({
                                ok: false,
                                code: 500,
                                data: false,
                                message: 'Internal Server Error 4',
                                error: stderr
                            });
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
            }).catch((error) => {
                res.status(500).json({
                    ok: false,
                    code: 500,
                    data: false,
                    message: 'Internal Server Error 5',
                    error: error
                })
            })
        } else {
            res.status(400).json({
                ok: false,
                code: 417,
                data: false,
                message: 'Bad Request'
            });
        }
    }
}
export const TweetExecutePreProcess = (req, res, next) => {
    if (HeaderCheck(req, res)) {

        const idProgress = nanoid(8);
        ProgressCreateUpdate(idProgress, 1);
        res.status(200).json({
            ok: true,
            code: 200,
            data: idProgress
        });

        const command = `python Python/preprocessing.py`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                ProgressCreateUpdate(idProgress, 2);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                ProgressCreateUpdate(idProgress, 2);
                return;
            }
            console.log(0);
            ProgressCreateUpdate(idProgress, 0);
            // console.log(`stdout: ${stdout}`);

        });
    }
}

export const getPullTweet = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        rawtweet.findAll({
            attributes: [
                [sequelizes.literal('row_number() over (order by id)'), 'row_number'],
                'text_raw', 'time_slot'
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
            })
        })
    }
}

export const getPreProcessTweet = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        rawtweet.findAll({
            attributes: [
                [sequelizes.literal('row_number() over (order by id)'), 'row_number'],
                'username', 'text_raw', 'text_process'
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
            })
        })
    }
}

export const reCheckProgress = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        if (req.params.id) {
            console.log(Math.floor(Date.now() / 1000));
            ProgressRead(req.params.id).then((resolve) => {
                console.log(`reProcess ${resolve}`);
                if (resolve == 0) {
                    res.status(200).json({
                        ok: true,
                        code: 200,
                        data: false
                    })
                    ProgressDelete(req.params.id);
                } else if (resolve == 2) {
                    res.status(500).json({
                        ok: false,
                        code: 500,
                        data: false,
                        message: 'Internal Server Error',
                    })
                } else {
                    res.status(200).json({
                        ok: false,
                        code: 200,
                        data: false
                    })
                }
            }).catch((reject) => {
                res.status(500).json({
                    ok: false,
                    code: 500,
                    data: false,
                    message: 'Internal Server Error',
                    error: reject
                })
            })
        } else {
            res.status(400).json({
                ok: false,
                code: 400,
                data: false,
                message: 'Bad Request',
            })
        }
    }
}

export const isPulled = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        rawtweet.count({
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

export const isPreProcessed = (req, res, next) => {
    if (HeaderCheck(req, res)) {
        rawtweet.count({
            col: 'text_process',
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
