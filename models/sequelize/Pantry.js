module.exports = (sequelize, DataTypes) => {
    const Pantry = sequelize.define('Pantry');

    Pantry.associate = models => {
        Pantry.hasMany(models.PantryItem, {as: 'Items'});
        Pantry.belongsTo(models.User);
    };

    return Pantry;
};
