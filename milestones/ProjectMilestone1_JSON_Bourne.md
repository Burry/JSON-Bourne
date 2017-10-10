# Proposal

### Team Name
JSON Bourne

### Members
- [Austin Rugh](https://github.com/arugh21)
- [Gabe Faber](https://github.com/gabefaber)
- [Grant Burry](https://github.com/Burry)
- [Jake Johnson](https://github.com/jjohnson5253)
- [Yongbo Shu](https://github.com/yosh3289)

### Description
Throughout the course of this semester we will be developing a recipe finder application. This app will be connected to a database of recipes compiled from publicly available data. This database will store recipe instructions, ingredients (including their cost and nutritional information), and user data (app preferences, cooking/dietary preferences, and authentication information). Users will search for recipes with detailed criteria such as preferred/disliked ingredients, allergy information, prep time, necessary kitchen ware, and dietary restrictions. These criteria can be saved to a user's profile for future searches. If no results are found the application will offer to continously check for new recipes added to its database and will notify the user if a matching one is found. When a user selects a recipe, a shopping list of ingredients will be generated along with their total estimated cost. The nutritional value of the recipe will also be presented. Users can contribute data by uploading custom recipes or "forking" existing recipes for modification.

This is the initial scope of the project, and more advanced features are planned depending upon the rate of development. With a database that contains retail information, the application could enhance shopping lists by directing users to a nearby store that sells a given recipe's ingredients for the lowest price. Adding substitution information for each ingredient in the database would give users more flexibility to customize a recipe for nutrition or dietary preferences/restrictions while knowing that it will still taste very similar to the original. Our initial scope includes adding specialized recipes for vegan, vegetarian, and gluten-free users, but including ingredient substitutions would provide these users more control to choose any recipe and modify it to their requirements. Like other custom recipes, recipes that contain substitutions could also be submitted to the database for public use.

An additional layer of functionality that we plan on building given enough time is tracking the ingredients a user has purchased. If a user indicates that they have purchased an ingredient, we could track the quantity of the ingredient that they have remaining in their inventory and suggest further recipes to make without needing to restock. Users would also be able to manually add and remove ingredients from their tracked inventory.

### Vision Statement
Our mission is to create an application that makes cooking easier, more accessible, and more personalized for every individual, empowering users to discover new ways of eating healthy without hassle that conform to their needs.

### Motivation
Half the difficulty of cooking is finding the right recipe, and there is no turn-key solution for consumers to discover and curate recipes from the Internet that meet their dietary/cooking requirements. Our goal is to fill this void and to make the experience of finding something to make seem automatic. By giving users powerful tools to discover recipes and find the right ingredients, we seek to streamline the cooking experience from the user who dislikes cooking to the user who struggles finding recipes due to their allergies or dietary requirements.

### Risks
The biggest risk for this project is collecting a wealth of recipe, ingredient, and store information for our database. An additional risk is the inexperience of our team regarding web application development.

### Risk Mitigation Plan
To mitigate these risks we will start with developing basic functionality that we are confident we can develop such as recipe search and user profiles. These initial features will be functional with a limited database. To mitigate our lack of experience, our application will be developed using [Node.js](https://nodejs.org/en), as our team does have experience with JavaScript, and we believe that we will be able to progress with Node quicker than with LAMP, Ruby on Rails, or Java/Spring.

### Version Control
We will be working collaboratively via GitHub and using [Circle CI](https://circleci.com) for continuous integration.

### Development Method
We plan on using Agile methodology with the Scrum framework (although with holding meetings twice a week).

### Collaboration Tool
We will use Slack as a primary means of team communication with app integrations for GitHub, Circle CI, and Trello.

### Proposed Architecture
We propose building an application on the [Node.js](https://nodejs.org/en) runtime for its relative ease of development and deployment, event-driven programming style, and broad availability of community modules. We will utilize the Node module [Express.js](https://expressjs.com) as our HTTP server to serve HTML, CSS, frontend JavaScript, static files, and an API. Our method of scraping recipe and ingredient information will be different depending on the source, but in most cases it is likely we will be using a Python script with the [Requests library](http://docs.python-requests.org/en/master/). Our frontend HTML will be rendered server-side using the [Pug.js](https://pugjs.org) templating engine so that our pages can be dynamic and modular. Our stylesheet will be developed in [Sass](http://sass-lang.com) and compiled to CSS to extend CSS's native feature set. Depending on what we are allowed to use, we propose using [MongoDB](https://www.mongodb.com) as our database integrated into our Node application with [Mongoose.js](http://mongoosejs.com) to handle object modeling and boilerplate logic. If we are not permitted to use MongoDB, our alternative is to use PostgreSQL or MySQL running on [Google Cloud SQL](https://cloud.google.com/sql) with [Sequelize](http://docs.sequelizejs.com) for object modeling. We intend to use [Mocha.js](https://mochajs.org/), a test framework, and [Chai.js](http://chaijs.com), an assertion library, to perform unit tests. [Circle CI](https://circleci.com) will be used for continuous integration. It will automatically perform our unit tests upon pushing to the master branch of the GitHub repository, and if tests are passed Circle CI will automatically deploy the application to [App Engine](https://cloud.google.com/appengine) on [Google Cloud Platform](https://cloud.google.com/).
