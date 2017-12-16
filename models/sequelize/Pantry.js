module.exports = (sequelize, DataTypes) => {
    const Pantry = sequelize.define('Pantry', {
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Pantry.associate = models => {
        Pantry.hasMany(models.PantryItem, {as: 'Items'});
        Pantry.belongsTo(models.User);
    };

    return Pantry;
};
