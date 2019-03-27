module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: { filename: './lambda.sqlite3' },
    seeds: { directory: './seeds' }
  }
};
