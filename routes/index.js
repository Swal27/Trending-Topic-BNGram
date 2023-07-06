import express from 'express';

import { testo, testo2 } from '../Controllers/TestFile.js';
import { TweetExecutePreProcess, TweetExecuteProcess, getPreProcessTweet, getPullTweet, isPreProcessed, isPulled, reCheckProgress } from '../Controllers/TweetController.js';
import { ClusterJson, ResultExecuteCluster, ResultExecuteProcess, ResultJson, getAllResult, getImageResult, isProcessed, } from '../Controllers/ResultController.js';


const router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'KKP Server Side' });
});

router.get('/test', testo);
router.get('/test2/:file', testo2);

router.post('/ExecuteTweetProcess', TweetExecuteProcess);
router.post('/ExecuteTweetPreProcess', TweetExecutePreProcess);
router.get('/GetPullTweet', getPullTweet);
router.get('/GetPreProcessTweet', getPreProcessTweet);

router.post('/ExecuteResultProcess', ResultExecuteProcess);
router.post('/ExecuteResultCluster', ResultExecuteCluster);
router.get('/GetAllResult', getAllResult);
router.get('/GetImageResult/:file', getImageResult);

router.get('/ClusterJson', ClusterJson);
router.get('/ResultJson', ResultJson);

router.get('/reCheckProgress/:id', reCheckProgress);

router.get('/isPulled', isPulled);
router.get('/isPreProcessed', isPreProcessed);
router.get('/isProcessed', isProcessed);



export default router;
