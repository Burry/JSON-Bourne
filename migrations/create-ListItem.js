module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('ListItem', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: Sequelize.STRING,
            complete: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: Sequelize.DATE,
            listId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'ShoppingList',
                    key: 'id',
                    as: 'listId'
                }
            }
        }),
    down: (queryInterface /* , Sequelize */) =>
        queryInterface.dropTable('ListItem')
};
