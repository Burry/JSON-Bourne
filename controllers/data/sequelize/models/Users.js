module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.number,
      allowNull: false,
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

  return User
};
