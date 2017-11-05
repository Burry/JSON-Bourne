module.export = (sequelize, DataTypes) => {
  const Pantry = sequelize.define('Pantry', {
    Owner: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

  });
  Pantry.associate = (models) => {
    Pantry.hasMany(models.PantryItem, {
      foreignKey: 'PantryId',
      as: 'PantryItems',
    });
    Pantry.belongsTo(models.User, {
      foreignKey: 'Userid',
      onDelete: 'CASCADE',
    });
  };
  return Pantry;
};
