# Proposal

*Will convert to PDF when ready to submit*

[See milestone instructions](https://github.com/Burry/JSON-Bourne-Temp-Name/milestone/1)

---

**Team Name:** JSON Bourne *[rename to project name when determined]*

**Members:**
- Austin Rugh
- Gabe Faber
- Grant Burry
- Jake Johnson
- Yongbo Shu

**Description:** Throughout the course of this semester we will be developing a recipe finder app. This recipe app will be connected to an open source recipe database, and will be able to search for recipes with extensive search criteria. Each user will define certain ingrediants that they really like or really hate, allergy information, restrictions on prep time and kitchen ware (like if you have a grill or not), and dietarty restrictions, and the app will filter recipes based on this information. If no results were found, The app will continue to check the database for updates and will notify the user if a new recipe was added to the database that matches search criteria. The user will also be able to make modifications to existing recipes and add it as a new recipe to the database. If a recipe was found that the user wants to make, the app would automatically generate a shopping list. We will start with this, and if we get this running we have tons of ways to expand this idea.

**Vision Statement:** The fully expanded version of this app will have a database that stores information about every ingrediant used in every recipe. Such information includes price, where these ingredients can be bought, nutritional value, and possible substitutions. If we could have access to such a database, the app could calculate the nutritional value of each recipe and the cost to buy all the ingredients. The app could tell you which store has all the ingrediants for the lowest price and is the closest to the users current location, and could suggest ways of making the recipe healthier by substituting certain ingredients. We can even add in settings for vegan, vegitarian, gluten-free, etc. where the app can customize existing recipes to make them conform with the users dietary restrictions. There would be a hard-coded substution for eggs, cheese, milk, bread, meat, etc. As an example, the veganization of a recipe would generate a vegan version of that recipe and automatically add it to the database for reuse by other vegans. Also, the app could track which recipes you have already made and from this generate an inventory for each user (the inventory would be a list of ingredients that the user already has in their kitchen) and use this to search for recipes that the user can make without going to the store. The user will be able to add and remove things to their inventory if they run out of an ingredient, or have ingredients from before they started using the app.

**Motivation:** This app would help make the process of cooking much easier because half the battle of cooking is finding a good recipe, and making a shopping list with all the ingredients required minus the ingredients that are already in the pantry. This could also help people with food allergies and dietary restrictions, since these things make cooking even harder.

**Risks:** The biggest risk is going to be weather or not we can have access to all the information needed for the full expansion.

**Risk Mitigation Plan:** To mitigate these risks, we will start off with basic functionality since all thats required for this is an open source recipe database which we know we can find plenty of on the web. We could set up a meeting with some of the major grocery store chains and request access to price data, and maybe there is an open source database for nutritional information on the web that we can use. 

**Version Control:** We will be working collaboratively via GitHub and using [Circle CI](https://circleci.com) for continuous integration.

**Development Method:**

**Collaboration Tool:** We will use Slack with GitHub, Circle CI, and Trello app integrations as a primary means of team communication.

**Proposed Architecture:** We propose building an application on the [Node.js](https://nodejs.org/en) runtime for its event-driven programming style, non-blocking I/O model, and broad availability of community modules. We will utilize the Node module [Express.js](https://expressjs.com) as our HTTP server to serve HTML, CSS, frontend JavaScript, static files, and an API. Our frontend HTML will be rendered server-side using the [Pug.js](https://pugjs.org) templating engine so that our pages can be dynamic and modular. Our stylesheet will be developed in [Sass](http://sass-lang.com) and compiled to CSS to extend CSS's native feature set. Depending on what we are allowed to use, we propose using [MongoDB](https://www.mongodb.com) as our database integrated into our Node application with [Mongoose.js](http://mongoosejs.com) to handle object modeling and boilerplate logic. If we are not permitted to use MongoDB, our alternative is to use PostgreSQL or MySQL running on [Google Cloud SQL](https://cloud.google.com/sql). We intend to use [Mocha.js](https://mochajs.org/), a test framework, and [Chai.js](http://chaijs.com), an assertion library, to perform unit tests. [Circle CI](https://circleci.com) will be used for continuous integration. It will automatically perform our unit tests upon pushing to the master branch of the GitHub repository, and if tests are passed Circle CL will automatically deploy the application to [App Engine](https://cloud.google.com/appengine) on [Google Cloud Platform](https://cloud.google.com/).
