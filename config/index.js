require('dotenv').config();

module.exports.Config = {
    port: process.env.PORT || 3002,
    api: process.env.API || '',
};