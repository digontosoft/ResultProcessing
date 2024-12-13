const swaggerJsDoc = require("swagger-jsdoc");
const authDocs = require("./docs/auth");
const teacherDocs = require("./docs/teacher");
const teacherVsSubjectDocs = require("./docs/teacherVsSubject");

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
  components: {
    securitySchemes: {
      Bearer: {
        type: "http", 
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  security: [
    {
      Bearer: []
    }
  ]
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [], // You can include files here for automatic parsing
};

// Merge paths
swaggerOptions.swaggerDefinition.paths = {
  ...authDocs.paths,
  ...teacherDocs.paths,
  ...teacherVsSubjectDocs.paths,
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;
