//student related api documentation

const studentDocs = {
  paths: {
    "/get-student-by-roll-range": {
      post: {
        tags: ["Student"],
        summary: "Get students by roll number range",
        description: "Get students by roll number range",
        security: [{
          Bearer: []
        }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  startRoll: { type: "number", example: 1 },
                  endRoll: { type: "number", example: 20 },
                },
              },
            },
          },
        },
        responses: {
            200: {
                description: "Students fetched successfully",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                data: { type: "array", items: { type: "object" } }
                            }
                        }
                    }
                }
            }
        }
      }
    }
  }
}

module.exports = studentDocs;