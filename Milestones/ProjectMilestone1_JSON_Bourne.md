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

**Description:** Throughout the course of this semester we will be developing a recipe finder app.

**Vision Statement:**

**Motivation:**

**Risks:**

**Risk Mitigation Plan:**

**Version Control:** We will be working collaboratively via GitHub and using [Circle CI](https://circleci.com) for continous integration.

**Development Method:**

**Collaboration Tool:** We will use Slack with GitHub, Circle CI, and Trello app integrations as a primary means of team communication.

**Proposed Architecture:** We propose building an application on the [Node.js](https://nodejs.org/en) runtime for its event-driven programming style, non-blocking I/O model, and broad availability of community modules. We will utilize the Node module [Express.js](https://expressjs.com) as our HTTP server to serve HTML, CSS, frontend JavaScript, static files, and an API. Our frontend HTML will be rendered server-side using the [Pug.js](https://pugjs.org) templating engine so that our pages can be dynamic and modular. Our stylesheet will be developed in [Sass](http://sass-lang.com) and compiled to CSS to extend CSS's native feature set. Depending on what we are allowed to use, we propose using [MongoDB](https://www.mongodb.com) as our database integrated into our Node application with [Mongoose.js](http://mongoosejs.com) to handle object modeling and boilerplate logic. If we are not permitted to use MongoDB, our alternative is to use PostgreSQL or MySQL running on [Google Cloud SQL](https://cloud.google.com/sql). We intend to use [Mocha.js](https://mochajs.org/), a test framework, and [Chai.js](http://chaijs.com), an assertion library, to perform unit tests. [Circle CI](https://circleci.com) will be used for continous integration. It will automatically perform our unit tests upon pushing to the master branch of the GitHub repository, and if tests are passed Circle CL will automatically deploy the application to [App Engine](https://cloud.google.com/appengine) on [Google Cloud Platform](https://cloud.google.com/).
