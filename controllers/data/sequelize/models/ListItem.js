models.export = (sequelize, DataTypes) => {
  const ListItem = sequelize.define('ListItem', {
    Name: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    complete:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  ListItem.associate = (models) => {
    ListItem.belongsTo(models.ShoppingList, {
      foreignKey: 'listId',
      onDelete: 'CASCADE',
    });
  };
  return ListItem;
};
