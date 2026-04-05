const Joi = require('joi');
const ArticleModel = require("../models/article.model.js");

const postArticle = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).required(),
        content: Joi.string().min(20).required(),
        author: Joi.string().optional().default("Guest"),
        tags: Joi.array().items(Joi.string()).optional(),
        category: Joi.string().optional(),
        isPublished: Joi.boolean().optional()
    });

    const {error, value} = articleSchema.validate(req.body);

    if (error){
        console.error(error);
        return res.status(400).json("Please provide article title and content")
    }

    try{
        const newArticle = new ArticleModel(value);
        await newArticle.save();
        return res.status(201).json({
            message: "Article created",
            data: newArticle
        });
    }
    catch(error){
        console.error(error);
        next(error);
    }
}

const getAllArticles = async (req, res, next) => {
    const {limit = 10, page = 1} = req.query;
    const skip = (page - 1) * limit;

    try{
        const articles = await ArticleModel.find({})
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
    const articleSchema = Joi.object({
        title: Joi.string().min(5).optional(),
        content: Joi.string().min(20).optional(),
        author: Joi.string().optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        category: Joi.string().optional(),
        isPublished: Joi.boolean().optional(),
        likes: Joi.number().optional(),
        views: Joi.number().optional()
    });

    const {error, value} = articleSchema.validate(req.body);

    if(error){
        console.error(error);
        return res.status(400).json('Please provide article title and content');
    }

    try{
        const updatedArticle = await ArticleModel.findByIdAndUpdate(req.params.id, {...value},
            {
                new: true,
                runValidators: true,
            }
        );

        if(!updatedArticle){
            return res.status(404).json({
                message: "article not found",
            });
        }

        res.status(200).json({
            message: "article updated",
            data: updatedArticle,
        });
    }
    catch(error){
        console.error(error);
        next(error);
    }
}

const deleteArticleByID = async (req, res, next) => {
    try{
        const article = await ArticleModel.findByIdAndDelete(req.params.id);

        if(!article){
            return res.status(404).json({
                message: 'Article not found'
            });
        }

        res.status(200).json({
            message: 'Article deleted'
        });
    }
    catch(error){
        console.error(error);
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