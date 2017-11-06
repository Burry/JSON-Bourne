module.exports = (sequelize, DataTypes) => {
    const PantryItem = sequelize.define('PantryItem', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    PantryItem.associate = models => {
        PantryItem.belongsTo(models.Pantry, {
            foreignKey: 'pantryId',
            onDelete: 'CASCADE'
        });
    };

    return PantryItem;
};
