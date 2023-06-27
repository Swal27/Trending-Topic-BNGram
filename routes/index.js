import express from 'express';

import { testo, testo2 } from '../Controllers/TestFile.js';
import { TweetExecuteProcess, TweetdeleteAllData, getAllTweet } from '../Controllers/TweetController.js';
import { ResdeleteAllData, ResultExecuteProcess, getAllResult } from '../Controllers/ResultController.js';


const router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'KKP Server Side' });
});

router.get('/test', testo);
router.get('/test2/:file', testo2);

router.get('/ExecuteTweet', TweetExecuteProcess);
router.get('/GetAllTweet', getAllTweet);
router.delete('/DeleteAllTweet', TweetdeleteAllData);

router.get('/ExecuteTweet', ResultExecuteProcess);
router.get('/GetAllResult', getAllResult);
router.get('/GetImageResult/:file', getAllResult);
router.delete('/DeleteAllResult/:file', ResdeleteAllData);




export default router;
