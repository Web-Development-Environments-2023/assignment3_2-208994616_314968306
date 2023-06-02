-- Active: 1685280459385@@127.0.0.1@3306@hw


CREATE TABLE Users (
  username VARCHAR(8) PRIMARY KEY NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

CREATE TABLE UserRecipes (
  recipeID INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(8) NOT NULL,
  RecipeImg VARCHAR(255) NOT NULL,
  RecipeName VARCHAR(255) NOT NULL,
  CookingTime INT NOT NULL,
  GlutenFree BOOLEAN NOT NULL,
  isVegan BOOLEAN NOT NULL,
  isVegetarian BOOLEAN NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  servings INT NOT NULL,
  FOREIGN KEY (username) REFERENCES Users(username)
);

CREATE TABLE FavoriteRecipes (
  username VARCHAR(8) NOT NULL,
  recipeID INT NOT NULL,
  FOREIGN KEY (username) REFERENCES Users(username),
  PRIMARY KEY(username, recipeID)
);

CREATE TABLE WatchedRecipes (
  username VARCHAR(8) NOT NULL,
  recipeID INT NOT NULL,
  creation_time DATETIME,
  FOREIGN KEY (username) REFERENCES Users(username),
  PRIMARY KEY(username, recipeID)
);

INSERT INTO WatchedRecipes (username, recipeID, creation_time)
VALUES ('User', 100, NOW());