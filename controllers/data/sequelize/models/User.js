module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    });

    User.associate = models => {
        User.hasMany(models.Substitution, {
            foreignKey: 'userId',
            as: 'ingredientSubstitutions'
        });
        User.hasOne(models.Pantry, {
            foreignKey: 'userId',
            as: 'pantry'
        });
        User.hasMany(models.ShoppingList, {
            foreignKey: 'userId',
            as: 'shoppingLists'
        });
    };

    return User;
};
