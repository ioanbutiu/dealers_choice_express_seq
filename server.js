const express = require('express');
const app = express();
const { setupDB, User, Joke } = require('./db');

app.use('/static', express.static('public'));

app.get('/', async (req, res, next) => {
  try {
    const [users] = await Promise.all([
      Joke.findAll(),
      User.findAll(),
      // User.findAll({
      //   include: [Joke],
      // }),
    ]);
    res.send(`
    <html>
      <head>
        <title>Comedy Heaven</title>
        <link rel='stylesheet' href='/static/style.css'>
      </head>
      <body>
        <h1>Comedy Heaven</h1>
        <main>
          <ul>
            ${users
              .map((user) => {
                return `
                <li>
                  <p>${user.text}</p>
                  <small>${user.name}</small></li>
                `;
              })
              .join('')}
          </ul>
        </main>
      </body>
    </html> 
    `);
  } catch (ex) {
    next(ex);
  }
});

const setup = async () => {
  try {
    await setupDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening  on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

setup();
