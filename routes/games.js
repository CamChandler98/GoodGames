const express = require('express');

const { Op } = require('sequelize');

const { asyncHandler } = require('./utils');
const { Game, Review, User } = require('../db/models');
const { reviewValidators, jsonValidationHandler } = require('./validators');


const router = express.Router();

router.get('/games', asyncHandler(async (req, res) => {
    const games = await Game.findAll();

    res.render('games', { title: 'Games', games })
}))

router.get('/games/:gameId(\\d+)', asyncHandler(async (req, res) => {
    const gameId = req.params.gameId;
    const game = await Game.findByPk(gameId, {
        include: {
            model: Review,
            include: User
        }
    });

    res.render('game-page', { title: `Game - ${game.title}`,  game })
}))

router.post('/api/games/:gameId(\\d+)/reviews', reviewValidators, jsonValidationHandler, asyncHandler(async (req, res) => {
    // this route will only be hit by our front end javascript file
    // will create a new review and return the new review
    console.log('hit this route')
    const userId = res.locals.user.id
    const user = await User.findByPk(userId);

    const { content, rating } = req.body;
    const gameId = req.params.gameId;
    const review = await Review.create({
        content,
        rating,
        userId,
        gameId,
    })

    res.status(201).json({ review, user });
}))


// DELETE GAME FROM SHELF
router.post('/games/:gameId/delete', asyncHandler(async (req, res) => {
    const gameId = parseInt(req.params.gameId, 10);
    const { shelfId } = req.body;

    const game = await Game.findByPk(gameId);

    await game.removeUserShelves(shelfId)

    res.redirect(`/shelves/${shelfId}`)
}))

router.post('/search', asyncHandler(async (req,res) => {
    const {term} = req.body
    let foundGames = await Game.findAll({
        where:
        {
          title: { [Op.iLike]: '%'+ term + '%' }
        }
    })
    res.json(foundGames)
}))

module.exports = router;
