module.exports = (sequelize, DataTypes) => {
    const Substitution = sequelize.define('Substitution', {
        ingredient: {
            type: DataTypes.STRING,
            allowNull: false
        },
        replacement: {
            type: DataTypes.STRING,
            allowNullL: false
        }
    });

    Substitution.associate = models => {
        Substitution.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return Substitution;
};
