module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            primaryKey: true,
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        lastName: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_login: {
            type: DataTypes.DATE
        },
        fbProfileId: DataTypes.STRING,
        fbAvatar: DataTypes.STRING,
        fbAccessToken: DataTypes.STRING,
        fbRefreshToken: DataTypes.STRING,
        resetPasswordKey: DataTypes.STRING
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
