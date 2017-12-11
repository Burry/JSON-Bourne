'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const sql = require('../models').sql;
const User = sql.User;
const ListItem = sql.ListItem;
const PantryItem = sql.PantryItem;
const Pantry = sql.Pantry;
const ShoppingList = sql.ShoppingList;
const Substitution = sql.Substitution;

const sync = sql.sequelize.sync({ force: true, logging: false });

describe('Sequelize Models', () => {
    before(() => sync);

    after(() => sync);

    describe('User.create()', () => {
        it('should save new user to database', () => {
            let user = {
                userId: 'TEST_USER_0',
                firstName: 'Jon',
                lastName: 'Doe',
                email: 'jondoe@findmyappetite.com',
                password: 'hunter2',
                resetPasswordKey: 'youllneverguessthis'
            };
            return User.create(user);
        });
    });

    describe('Substitution.create()', () => {
        it('should save new list item to database', () => {
            let substitution = {
                ingredient: 'TEST_INGREDIENT_0',
                replacement: 'TEST_INGREDIENT_1'
            };
            return Substitution.create(substitution);
        });
    });

    describe('PantryItem.create()', () => {
        it('should save new pantry item to database', () => {
            let pantryItem = {
                name: 'Test Pantry Item',
            };
            return PantryItem.create(pantryItem);
        });
    });

    describe('Pantry.create()', () => {
        it('should save new pantry to database', () => {
            let pantry = {
                owner: 'TEST_USER_0',
                pantryItems: ['Test Pantry Item']
            };
            return Pantry.create(pantry);
        });
    });

    describe('ListItem.create()', () => {
        it('should save new list item to database', () => {
            let listItem = {
                name: 'Test List Item',
                complete: false
            };
            return ListItem.create(listItem);
        });
    });

    describe('ShoppingList.create()', () => {
        it('should save new list item to database', () => {
            let shoppingList = {
                listId: 0,
                listItems: [0]
            };
            return ShoppingList.create(shoppingList);
        });
    });
});
