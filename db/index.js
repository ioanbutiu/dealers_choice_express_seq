const Sequelize = require('sequelize');
const { STRING } = require('sequelize');
const { INTEGER } = require('sequelize');
const { TEXT } = require('sequelize');
const { DATE } = require('sequelize');
const conn = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_express_seq'
);

const User = conn.define('user', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Joke = conn.define('joke', {
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  text: {
    type: TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Joke.belongsTo(User);
User.hasMany(Joke);

// const Upvote = conn.define('upvote', {
//   count: {
//     type: INTEGER,
//     validate: {
//       notEmpty: true,
//     },
//   },
//   userId: {
//     type: INTEGER,
//     allowNull: false,
//   },
//   jokeId: {
//     type: INTEGER,
//     allowNull: false,
//   },
// });

const setupDB = async () => {
  await conn.sync({ force: true });

  const [adam, barry, caitlyn, david] = await Promise.all([
    User.create({ name: 'adam' }),
    User.create({ name: 'barry' }),
    User.create({ name: 'caitlyn' }),
    User.create({ name: 'david' }),
  ]);

  await Promise.all([
    Joke.create({
      userId: adam.id,
      text: "I like rice. Rice is great when you're hungry and you want 2,000 of something.",
    }),
    Joke.create({
      userId: barry.id,
      text: 'Is a hippopotamus really a hippopotomus or just a really cool opotamus?',
    }),
    Joke.create({
      userId: caitlyn.id,
      text: 'I think foosball is a combination of soccer and shishkabobs.',
    }),
    Joke.create({
      userId: david.id,
      text: 'My fake plants died because I did not pretend to water them.',
    }),
  ]);
};

module.exports = {
  setupDB,
  User,
  Joke,
  // Upvote,
};
