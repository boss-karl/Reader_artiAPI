const express = require('express');
const {
    postArticle,
    getArticleByID,
    getAllArticles,
    updateArticleByID,
    deleteArticleByID,
    searchArticles
} = require('../controllers/article.controller.js');
const requireAuth = require('../middlewares/require-auth.js');

const router = express.Router();

router.post('/articles', requireAuth, postArticle);
router.get('/articles', requireAuth, getAllArticles);
router.get('/articles/search', requireAuth,  searchArticles);
router.get('/articles/:id', requireAuth,  getArticleByID);
router.put('/articles/:id', requireAuth, updateArticleByID);
router.delete('/articles/:id', requireAuth, deleteArticleByID);

module.exports = router;