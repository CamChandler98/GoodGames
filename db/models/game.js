'use strict';
module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('Game', {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        releaseDate: DataTypes.DATE
    }, {});
    Game.associate = function (models) {
        // associations can be defined here
        Game.hasMany(models.Review, { foreignKey: 'gameId' })
    };
    return Game;
};
