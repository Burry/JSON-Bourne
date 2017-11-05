modules.export = (sequelize, DataTypes) => {
  const ListItem = sequelize.define('ListItem', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  ListItem.associate = (models) => {
    ListItem.belongsTo(models.ShoppingList, {
      foreignKey: 'ListId',
      onDelete: 'CASCADE',
    });
  };
  return ListItem;
};
