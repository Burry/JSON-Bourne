module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Substitution', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Ingredient: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Replacement: {
        type: Sequelize.STRING,
        allowNullL: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UserId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'User',
          key: 'id',
          as: 'UserId'
        }
      }
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable('Substitution')
};
