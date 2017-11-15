--Database: recipe_finder_test

CREATE recipe_finder_test
	WITH
	OWNER  = postgres
	ENCODING = 'UTF8'
	LC_COLLATE = 'English_United States.1252'
	LC_CTYPE = 'Enligh_United States.1252'
	TABLESPACE = pg_default
	CONNECTION LIMIT = -1;

CREATE TABLE users (
	UserID int,
	FirstName varchar(255),
	LastName varchar(255),
	email varchar (255),
	password int,
);

CREATE TABLE recipes (
	RecipeID int,
	UserID int,
	name varchar (255),
	picture int,
	rating int,
);

CREATE TABLE ingredients(
	RecipeID int,
	ingredientName varchar (255),
	quantity int,
	measurementUnit varchar(255)
);

CREATE TABLE savedRecipes(
	UserID int,
	RecipeID int,
);

CREATE TABLE pantryItems (
	UserID int,
	ingredientName varchar(255),
	pantryQuantity int,
	measurementUnit varchar(255),
);

CREATE TABLE shoppingList(
	UserID int,
	shoppingListID int,
);

CREATE TABLE shoppingListItems(
	shoppingListID int,
	ingredientName varchar(255),
	quantity int,
	measurementUnit varchar(255),
);
