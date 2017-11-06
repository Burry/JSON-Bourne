module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    FirstName: {
      type: DataTypes.STRING
    },
    LastName: {
      type: DataTypes.STRING
    },
    Email: {
      type: DataTypes.STRING
    },
    Password: {
      type: DataTypes.STRING
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Substitution, {
      foreignKey: 'UserId',
      as: 'IngredientSubstitutions'
    });
    User.hasOne(models.Pantry, {
      foreignKey: 'UserId',
      as: 'Pantry'
    });
    User.hasMany(models.ShoppingList, {
      foreignKey: 'UserId',
      as: 'ShoppingLists'
    });
  };
  return User;
};
