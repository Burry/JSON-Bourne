module.exports = (sequelize, DataTypes) => {
    const ShoppingList = sequelize.define('ShoppingList', {
        listID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    ShoppingList.associate = models => {
        ShoppingList.hasMany(models.ListItem, {
            foreignKey: 'listID',
            as: 'listItems'
        });
        ShoppingList.belongsTo(models.User, {
            foreignKey: 'userID',
            onDelete: 'CASCADE'
        });
    };

    return ShoppingList;
};
