# Testing (Milestone 5)

### Team: [JSON Bourne](https://github.com/Burry/JSON-Bourne)

### Members
- [Austin Rugh](https://github.com/arugh21)
- [Gabe Faber](https://github.com/gabefaber)
- [Grant Burry](https://github.com/Burry)
- [Jake Johnson](https://github.com/jjohnson5253)
- [Yongbo Shu](https://github.com/yosh3289)

### Vision Statement
Our mission is to create an application that makes cooking easier, more accessible, and more personalized for every individual, empowering users to discover new ways of eating healthy without hassle that conform to their needs.


## User Acceptance Tests

#### Feature 1: User Sign Up

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
6.	The user can navigate to the aforementioned pages and add information about pantry items r view saved recipes.
7.	The user can log out of the site, at which point the user cannot access the profile page without signing back in.
8.	The user can return to the site and use the previously used information to log in to the site again. Once logged in, the user can view the profile page.
##### Testing Data
	User’s Name: John Doe
	User’s email: john.d@gmail.com
	Username: jd123
	Password: jd456

##### Testing Procedure:
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
