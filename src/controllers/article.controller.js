const Joi = require('joi');
const ArticleModel = require("../models/article.model.js");

const postArticle = async (req, res, next) => {
    try {
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const newArticle = new ArticleModel({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id,
            images: imageUrls
        });
        console.log(req.files);
        console.log(imageUrls);

        await newArticle.save();

        return res.status(201).json({
            message: "Article created",
            data: newArticle
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getAllArticles = async (req, res, next) => {
    const {limit = 10, page = 1} = req.query;
    const skip = (page - 1) * limit;

    try{
        const articles = await ArticleModel.find({}).populate("author", "name _id email")
        .sort({createdAt: - 1})
        .limit(limit)
        .skip(skip);
        
        return res.status(200).json({
            message: "Article fetched",
            data: articles
        });
    }
    catch(error){
        console.error(error);
        next(error);
    }
}

const getArticleByID = async (req, res, next) => {
    try{
        const article = await ArticleModel.findById(req.params.id);
        if(!article){
            return res.status(404).json({
                message: `Article with ${req.params.id} not found`
            });
        }

        return res.status(200).json({
            message: 'article found',
            data: article,
        });
    }
    catch(error){
        console.error(error);
        next(error);
    }
}

const updateArticleByID = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        // 🔥 OWNERSHIP CHECK
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to update this article"
            });
        }

        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "article updated",
            data: updatedArticle
        });

    } catch (error) {
        next(error);
    }
};

const deleteArticleByID = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        // 🔥 OWNERSHIP CHECK
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to delete this article"
            });
        }

        await ArticleModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Article deleted"
        });

    } catch (error) {
        next(error);
    }
};

const searchArticles = async (req, res, next) => {
    try {
        let { q, page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        let filter = {};

        if (q) {
            filter = {
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { content: { $regex: q, $options: 'i' } },
                    { author: { $regex: q, $options: 'i' } },
                    { tags: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } }
                ]
            };
        }

        const total = await ArticleModel.countDocuments(filter);

        // fetch paginated results
        const articles = await ArticleModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Search results",
            totalResults: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            data: articles
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    postArticle,
    getAllArticles,
    getArticleByID,
    updateArticleByID,
    deleteArticleByID,
    searchArticles
}