module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        resetPasswordKey: DataTypes.STRING
    });

    User.associate = models => {
        User.hasMany(models.Substitution, {
            foreignKey: 'userID',
            as: 'ingredientSubstitutions'
        });
        User.hasOne(models.Pantry, {
            foreignKey: 'userID',
            as: 'pantry'
        });
        User.hasMany(models.ShoppingList, {
            foreignKey: 'userID',
            as: 'shoppingLists'
        });
    };

    //User.create({ firstName: 'BillyBob'});



    return User;
};
