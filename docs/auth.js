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
                  required: ["phoneNumber", "password"],
                  properties: {
                    phoneNumber: {
                      type: "string",
                      example: "0123456789"
                    },
                    password: {
                      type: "string",
                      example: "123456"
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
                      phoneNumber: {
                        type: "string",
                        example: "0123456789"
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