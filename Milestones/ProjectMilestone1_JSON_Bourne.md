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

**Description:** Throughout the course of this semester we will be developing a recipe finder app. This recipe app will be connected to an open source recipe database, and will be able to search for recipes with extensive search criteria. Each user will define certain ingrediants that they really like or really hate, allergy information, restrictions on prep time and kitchen ware (like if you have a grill or not), and dietarty restrictions, and the app will filter recipes based on this information. If no results were found, The app will continue to check the database for updates and will notify the user if a new recipe was added to the database that matches search criteria. We will start with this, and if we get this running we have tons of ways to expand this idea.

**Vision Statement:** The fully expanded version of this app will have a database that stores information about every ingrediant used in every recipe. Such information includes price, where these ingredients can be bought, and nutritional value. If we could have access to such a database, the app could calculate the nutritional value of each recipe and the cost to buy all the ingredients. The app could tell you which store has all the ingrediants for the lowest price and is the closest to your current location, and could suggest ways of making the recipe healthier by substituting certain ingredients. We can even add in settings for vegan, vegitarian, gluten-free, etc. where the app can customize existing recipes to make them conform with your dietary restrictions. There would be a hard-coded substution for eggs, cheese, milk, bread, meat, etc. 

**Motivation:**

**Risks:**

**Risk Mitigation Plan:**

**Version Control:** We will be working collaboratively via GitHub and using [Circle CI](https://circleci.com) for continous integration.

**Development Method:**

**Collaboration Tool:** We will use Slack with GitHub, Circle CI, and Trello app integrations as a primary means of team communication.

**Proposed Architecture:** We propose building an application on the [Node.js](https://nodejs.org/en) runtime for its event-driven programming style, non-blocking I/O model, and broad availability of community modules. We will utilize the Node module [Express.js](https://expressjs.com) as our HTTP server to serve HTML, CSS, frontend JavaScript, static files, and an API. Our frontend HTML will be rendered server-side using the [Pug.js](https://pugjs.org) templating engine so that our pages can be dynamic and modular. Our stylesheet will be developed in [Sass](http://sass-lang.com) and compiled to CSS to extend CSS's native feature set. Depending on what we are allowed to use, we propose using [MongoDB](https://www.mongodb.com) as our database integrated into our Node application with [Mongoose.js](http://mongoosejs.com) to handle object modeling and boilerplate logic. If we are not permitted to use MongoDB, our alternative is to use PostgreSQL or MySQL running on [Google Cloud SQL](https://cloud.google.com/sql). We intend to use [Mocha.js](https://mochajs.org/), a test framework, and [Chai.js](http://chaijs.com), an assertion library, to perform unit tests. [Circle CI](https://circleci.com) will be used for continous integration. It will automatically perform our unit tests upon pushing to the master branch of the GitHub repository, and if tests are passed Circle CL will automatically deploy the application to [App Engine](https://cloud.google.com/appengine) on [Google Cloud Platform](https://cloud.google.com/).
