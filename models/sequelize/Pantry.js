module.exports = (sequelize, DataTypes) => {
    const Pantry = sequelize.define('Pantry', {
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });


    Pantry.associate = models => {
        Pantry.hasMany(models.PantryItem, {
            foreignKey: 'pantryId',
            as: 'pantryItems'
        });
        Pantry.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    //models.User.create({ firstName: 'BillyBob'});
    /*
    models.User.findAll().then(users => {
      console.info(users)
    }); */
    console.info("yo")

    Pantry.create({ owner: 'BillyOwner'});
/*
    Pantry.findAll().then(owners => {
      console.log(owners)
    }); */

    return Pantry;
};
