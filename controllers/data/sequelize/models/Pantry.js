module.export = (sequelize, DataTypes) => {
  const Pantry = sequelize.define('Pantry', {
    Owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  });
  Pantry.associate = (models) => {
    Pantry.hasMany(models.PantryItem, {
      foreignKey: 'PantryId',
      as: 'PantryItems',
    });
    Pantry.belongsTo(models.User, {
      foreignKey: 'UserId',
      onDelete: 'CASCADE',
    });
  };
  return Pantry;
};
