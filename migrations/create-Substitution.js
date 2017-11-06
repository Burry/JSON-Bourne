module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('Substitution', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ingredient: Sequelize.STRING,
            replacement: Sequelize.STRING,
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
        queryInterface.dropTable('Substitution')
};
