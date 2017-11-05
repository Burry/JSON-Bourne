modules.export = (sequelize, DataTypes) => {
  const PantryItem = sequelize.define('PantryItem', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  PantryItem.associate = (models) => {
    PantryItem.belongsTo(models.Pantry, {
      foreignKey: 'PantryId',
      onDelete: 'CASCADE',
    });
  };
  return PantryItem;
};
