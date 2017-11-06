module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('PantryItem', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: Sequelize.STRING,
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: Sequelize.DATE,
            pantryId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Pantry',
                    key: 'id',
                    as: 'pantryId'
                }
            }
        }),
    down: (queryInterface /* , Sequelize */) =>
        queryInterface.dropTable('PantryItem')
};
