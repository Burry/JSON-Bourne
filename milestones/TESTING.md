# Testing (Milestone 5)

#### Team: [JSON Bourne](https://github.com/Burry/JSON-Bourne)

#### Members
- [Austin Rugh](https://github.com/arugh21)
- [Gabe Faber](https://github.com/gabefaber)
- [Grant Burry](https://github.com/Burry)
- [Jake Johnson](https://github.com/jjohnson5253)
- [Yongbo Shu](https://github.com/yosh3289)

#### Vision Statement
Our mission is to create an application that makes cooking easier, more accessible, and more personalized for every individual, empowering users to discover new ways of eating healthy without hassle that conform to their needs.

## Automated Testing

#### How to Run Tests
Administering tests will be done with yarn, so to run tests, simply run the command `yarn test`.

#### Screenshot of Test Output

## User Acceptance Tests

### Feature 1: Search Recipes

##### Description
FindMyAppetite will have the capability for users to search for recipes that they find interesting. Our application will have recipe pages for thousands of different recipes from around the web which users can view, save, and share across social media.

##### Acceptance Requirements
1.	From the site home page, users will be able to use a search bar to find recipes.
2.	Searching recipes will display a list of recipe boxes, which will the title of the recipe, a picture of the completed recipe, and will serve as a link to the recipe page.
3.	Users will be able to click on these boxes, which will direct them to the recipe page for that recipe.

##### Testing Data
	Recipe Names: 1-2-3 Jambalaya, Chipotle Hummus, 1-2-3 Lasagna, Pasta e Fagioli, Beef Stroganoff, Apple Pie

##### Testing Procedure
1.	Using a compatible web browser, navigate to http://findmyappetite.com.
2.	Upon reaching the front page of the site, confirm that there is a search bar in the middle of the page.
3.	Click on the search bar and enter ‘1-2-3 Jambalaya’.
4.	Click on the first recipe that returns in the search results.
5.	Confirm that clicking on the recipe navigates to a recipe page for ‘1-2-3 Jambalaya’.
6.	Click on the ‘FindMyAppetite’ banner at the top of the page.
7.	Confirm that clicking on the banner navigates back to the front page of the site.
8.	Repeat Steps 3-7 for the other recipe names in the Testing Data section of this feature test.


### Feature 2: User Sign Up

##### Description
FindMyAppetite will have to ability for users to sign up for a profile that tracks their pantry items, their saved recipes, and other data that is important to their interaction with the application.
##### Acceptance Requirements
1.	Users can navigate to the sign up page through buttons on every page of the site.
2.	Users can use the sign up page to submit a username and password.
3.	The site checks the user table in the application database to check for repeated usernames.  
    a.	If no repeats are found, a user record is created with the submitted username and password.  
    b.	If a repeat is found, the username is rejected and the user must submit a new username. Repeat until a unique username is chosen.
4.	After signing up, the user is taken to a profile page, which includes fields for personal information and links to pages for saved recipes and pantry items.
5.	The user can submit personal information such as first name, last name and email. These are added to the user record.
6.	The user can navigate to the aforementioned pages and add information about pantry items or view saved recipes.
7.	The user can log out of the site, at which point the user cannot access the profile page without signing back in.
8.	The user can return to the site and use the previously used information to log in to the site again. Once logged in, the user can view the profile page.

##### Testing Data
	User’s Name: John Doe
	User’s email: john.d@gmail.com
	Username: jd123
	Password: jd456

##### Testing Procedure
1.	Using a supported web browser, navigate to http://findmyappetite.com.
2.	Click on the ‘Login’ button in the navbar at the top of the page.
3.	Click on the ‘Sign-Up’ link below the login credential form.
4.	Enter username and password.
5.	After credentials have been accepted, navigate to the user profile page.
6.	Click on ‘Add Email’ link, enter user email. Click on ‘Save Email’
7.	Click on ‘Saved Recipes’ button located in profile navbar, left side of the screen.
8.	Confirm that no recipes have been saved.
9.	Click on ‘Logout’ button in upper right corner.
10.	Click on ‘Login’ button in upper navbar.
11.	Enter user credentials.
12.	Navigate to user profile page.
13.	Confirm that the profile page matches page from before logout.
14.	Logout.

### Feature 3: Save Recipes
##### Description
FindMyAppetite will have the ability for users to, after logging in, save recipes that they want to refer to later. This will be done with a button included on every recipe page, and these saved recipes can be viewed through the user’s profile page.

##### Acceptance Requirements
1.	On all recipe pages, users can view and click a Save Recipe button.
2.	Using the button will display a confirmation message if the user is logged in and will display an error message if otherwise.
3.	Using the button adds a saved recipe record associated with the user record.
4.	From their profile page, users can navigate to a Saved Recipes page
5.	This page will display the recipe titles of every saved recipe record associated with the logged in user.
6.	These titles will also be links which direct to the respective recipe page.
7.	From this page, users can also view and click a ‘Remove Saved Recipe’ button.
8.	This button will remove the saved recipe record.

##### Testing Data
	User’s Name: John Doe
	User’s email: john.d@gmail.com
	Username: jd123
	Password: jd456
	Recipe: 1-2-3 Jambalaya

##### Testing Procedure
1.	Using a supported web browser, navigate to http://findmyappetite.com.
2.	Click on the ‘Login’ button in the navbar at the top of the page.
3.	Enter username and password.
4.	After credentials have been accepted, navigate to the user profile page.
5.	Click on ‘Saved Recipes’ button located in profile navbar, left side of the screen.
6.	Confirm that no recipes have been saved.
7.	Click on the ‘FindMyAppetite’ banner at the top of the page to navigate to the home page.
8.	Click on the search bar in the middle of the page and enter ‘1-2-3 Jambalaya’.
9.	Click on the first recipe that appears in the search results.
10.	Click on the ‘Save Recipe’ button along the top of the recipe.
11.	Navigate to the user profile page.
12.	Navigate to the ‘Saved Recipes’ page.
13.	Confirm that ‘1-2-3 Jambalaya’ is listed.
14.	Click on ‘1-2-3 Jambalaya’ to navigate to the recipe page.
15.	Logout.
