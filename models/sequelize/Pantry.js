module.exports = (sequelize, DataTypes) => {
    const Pantry = sequelize.define('Pantry', {
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Pantry.associate = models => {
        Pantry.hasMany(models.PantryItem, {
            foreignKey: 'pantryId',
            as: 'pantryItems'
        });
        Pantry.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return Pantry;
};
