module.exports = (sequelize, DataTypes) => {
    const ShoppingList = sequelize.define('ShoppingList');

    ShoppingList.associate = models => {
        ShoppingList.hasMany(models.ListItem, {as: 'Items'});
        ShoppingList.belongsTo(models.User);
    };

    return ShoppingList;
};
