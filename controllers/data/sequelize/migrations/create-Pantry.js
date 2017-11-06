module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('Pantry', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            owner: Sequelize.STRING,
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: Sequelize.DATE,
            userId: {
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
        queryInterface.dropTable('Pantry')
};
