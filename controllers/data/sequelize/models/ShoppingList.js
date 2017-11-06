module.exports = (sequelize, DataTypes) => {
  const ShoppingList = sequelize.define('ShoppingList', {
    listID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  });
  ShoppingList.associate = (models) => {
    ShoppingList.hasMany(models.ListItem, {
      foreignKey: 'listId',
      as: 'ListItems'
    });
    ShoppingList.belongsTo(models.User, {
      foreignKey: 'UserId',
      onDelete: 'CASCADE',
    });
  };

  return ShoppingList;
};
