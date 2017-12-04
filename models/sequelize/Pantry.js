module.exports = (sequelize, DataTypes) => {
    const Pantry = sequelize.define('Pantry', {
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Pantry.associate = models => {
        Pantry.hasMany(models.PantryItem, {
            foreignKey: 'pantryID',
            as: 'pantryItems'
        });
        Pantry.belongsTo(models.User, {
            foreignKey: 'userID',
            onDelete: 'CASCADE'
        });
    };

    return Pantry;
};
