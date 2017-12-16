module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        fbProfileId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fbAvatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fbAccessToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fbRefreshToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetPasswordKey: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    User.associate = models => {
        User.hasOne(models.Pantry, {as: 'Pantry'});
        User.hasMany(models.Substitution, {as: 'Substitutions'});
        User.hasMany(models.ShoppingList, {as: 'ShoppingLists'});
    };

    return User;
};
