let config = require('./config.json');

process.env.MongoDburl = config.mongoUri;
process.env.PORT = config.port;