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
const { validatePostArticle, validateUpdateArticle } = require('../validations/post.validations.js');

const router = express.Router();

router.use(requireAuth);

router.post('/articles', validatePostArticle, postArticle);
router.get('/articles', getAllArticles);
router.get('/articles/search',  searchArticles);
router.get('/articles/:id',  getArticleByID);
router.put('/articles/:id', validateUpdateArticle, updateArticleByID);
router.delete('/articles/:id', deleteArticleByID);

module.exports = router;