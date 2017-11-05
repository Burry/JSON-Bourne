module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.number,
      allowNull: false,
    },
    FirstName: {
      type: DataTypes.STRING,
    },
    LastName: {
      type: DataTypes.STRING,
    },
    Email: {
      type: DataTypes.STRING,
    },
    Password: {
      type: DataTypes.STRING,
    },
  });

  User.associate = (models) => {
    Users.hasMany(models.Substitution, {
      foreignKey: 'UserId',
      as: 'IngredientSubstitutions',
    });
    Users.hasOne(models.Pantry, {
      foreignKey: 'UserId',
      as: 'Pantry',
    });
    Users.hasMany(models.ShoppingList, {
      foreignKey: 'UserId',
      as: 'ShoppingLists',
    });
  };
  return User;
};
