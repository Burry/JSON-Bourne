module.exports = (sequelize, DataTypes) => {
    const ListItem = sequelize.define('ListItem', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        complete:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    ListItem.associate = models => {
        ListItem.belongsTo(models.ShoppingList);
    };

    return ListItem;
};
