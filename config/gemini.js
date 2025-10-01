const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apiKey: process.env.GEMINI_API_KEY,
  dbSchemaContext: process.env.DB_SCHEMA_CONTEXT // Load DB schema context
};