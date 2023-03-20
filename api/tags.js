const express = require('express');

const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
    next();
});

const { 
    getAllTags,
    getPostsByTagName
} = require('../db');

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    
    const { tagName } = req.params;
    
    try {

        const grabbedPosts = await getPostsByTagName(tagName);
        const filterPosts = grabbedPosts.filter(post => {
            return post.active || (req.user && post.author.id === req.user.id);
        })

        res.send({posts: filterPosts})

    } catch({name, message}) {
        next({
            name,
            message
        })
    }
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

module.exports = tagsRouter;