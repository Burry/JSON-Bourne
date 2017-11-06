module.exports = (sequelize, DataTypes) => {
  const Substitution = sequelize.define('Substitution', {
    Ingredient: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Replacement: {
      type: DataTypes.STRING,
      allowNullL: false
    }
  });

  Substitution.associate = (models) => {
    Substitution.belongsTo(models.User, {
      foreignKey: 'UserId',
      onDelete: 'CASCADE'
    });
  };
  return Substitution;
};
