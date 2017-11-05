<<<<<<< HEAD
modules.export = (sequelize, DataTypes) => {
=======
module.export = (sequelize, DataTypes) => {
>>>>>>> 8214a922deb881812bbc097e3875317cd0ae6f92
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
