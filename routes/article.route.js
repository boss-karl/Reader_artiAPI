const express = require('express');
const {
    postArticle,
    getArticleByID,
    getAllArticles,
    updateArticleByID,
    deleteArticleByID,
    searchArticles
} = require('../controllers/article.controller.js');

const router = express.Router();

router.post('/articles', postArticle);
router.get('/articles', getAllArticles);
router.get('/articles/search', searchArticles);
router.get('/articles/:id', getArticleByID);
router.put('/articles/:id', updateArticleByID);
router.delete('/articles/:id', deleteArticleByID);

module.exports = router;