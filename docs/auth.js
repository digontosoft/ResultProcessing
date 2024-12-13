/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Everything Authentication
 */
const authDocs = {
    paths: {
      "/login": {
        post: {
          tags: ["Auth"],
          summary: "User login",
          description: "Authenticate user and get JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      example: "supperadmin@example.com"
                    },
                    password: {
                      type: "string",
                      example: "password123"
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Login successful"
                      },
                      _id: {
                        type: "string",
                        example: "60d5ecb74d5c3d1b5c5c5c5c"
                      },
                      email: {
                        type: "string",
                        example: "john@example.com"
                      },
                      token: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: "Invalid credentials"
            }
          }
        }
      }
    }
  };
  
  module.exports = authDocs;