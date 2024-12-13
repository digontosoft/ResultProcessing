const swaggerJsDoc = require("swagger-jsdoc");
const authDocs = require("./docs/auth");
const teacherDocs = require("./docs/teacher");

// Base Swagger configuration
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API Documentation",
    version: "1.0.0",
    description: "API documentation for the project",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1", // Adjust this based on your setup
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [], // You can include files here for automatic parsing
};

// Merge paths
swaggerOptions.swaggerDefinition.paths = {
  ...authDocs.paths,
  ...teacherDocs.paths,
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;
