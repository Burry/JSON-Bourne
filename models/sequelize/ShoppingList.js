module.exports = (sequelize, DataTypes) => {
    const ShoppingList = sequelize.define('ShoppingList', {
        listID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    ShoppingList.associate = models => {
        ShoppingList.hasMany(models.ListItem, {
            foreignKey: 'listId',
            as: 'listItems'
        });
        ShoppingList.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return ShoppingList;
};
