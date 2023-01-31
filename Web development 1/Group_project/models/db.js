const mongoose = require('mongoose');

/**
 * Get database connect URL.
 *
 * Returns the MongoDB connection URL from DBURL environment variable,
 * or if the environment variable is not defined, return the default URL
 * mongodb://localhost:27017/WebShopDb
 *
 * @returns {string} connection URL
 */
const getDbUrl = () => {
  // TODO: 9.4 Implement this
  if(process.env.DBURL === undefined){
    return('mongodb://localhost:27017/WebShopDb');
  }
  else{
    return(process.env.DBURL);
  }
};

const connectDB = () => {
  // Do nothing if already connected
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    mongoose
      .connect(getDbUrl(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true
      })
      .then(() => {
        mongoose.connection.on('error', err => {
          console.error(err);
        });

        mongoose.connection.on('reconnectFailed', handleCriticalError);
      })
      .catch(handleCriticalError);
  }
};

const handleCriticalError = (err => {
  console.error(err);
  throw err;
});

const disconnectDB = () => {
  mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB, getDbUrl };