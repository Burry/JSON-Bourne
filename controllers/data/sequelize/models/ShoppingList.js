module.export = (sequelize, DataTypes) => {
  const ShoppingList = sequelize.define('ShoppingList', {
    listID: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

  });
  ShoppingList.associate = (models) => {
    ShoppingList.hasMany(models.ListItem, {
      foreignKey: 'listId',
      as: 'ListItems'
    });
    ShoppingList.belongsTo(models.User, {
      foreignKey: 'Userid',
      onDelete: 'CASCADE',
    });
  };

  return ShoppingList;
};
