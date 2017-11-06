module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('ShoppingList', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            listID: Sequelize.NUMBER,
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: Sequelize.DATE,
            UserId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'User',
                    key: 'id',
                    as: 'userId'
                }
            }
        }),
    down: (queryInterface /* , Sequelize */) =>
        queryInterface.dropTable('ShoppingList')
};
