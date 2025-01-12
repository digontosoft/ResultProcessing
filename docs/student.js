//student related api documentation

const studentDocs = {
  paths: {
    "/student-promotion":{
      post:{
        tags: ["Student"],
        summary: "Student promotion",
        description: "Student promotion",
        security: [
          {
            Bearer: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  promotedStudent: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          example: "676d86c520d17b6ce6deefdf"
                        },
                        studentId: {
                          type: "string",
                          example: "502"
                        },
                        class: {
                          type: "string",
                          example: "8"
                        },
                        section: {
                          type: "string",
                          example: "A"
                        },
                        shift: {
                          type: "string",
                          example: "Morning"
                        },
                        roll: {
                          type: "number",
                          example: 4
                        },
                        year: {
                          type: "string",
                          example: "2024"
                        },
                        group: {
                          type: "string",
                          example: "General"
                        }
                      }
                    }
                  },
                  
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Students promoted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/get-student-by-roll-range": {
      post: {
        tags: ["Student"],
        summary: "Get students by roll number range",
        description: "Get students by roll number range",
        security: [
          {
            Bearer: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  startRoll: { type: "number", example: 1 },
                  endRoll: { type: "number", example: 20 },
                  class: { type: "string", example: "4" },
                  section: { type: "string", example: "A" },
                  shift: { type: "string", example: "Morning" },
                  subject: { type: "string", example: "English 1st Paper" },
                  year:{
                    type:"string", example:"2024"
                  },
                  subject:{
                    type:"string", example:"English"
                  }
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
                    data: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/get-student-list":{
      post:{
        tags:["Student"],
        summary:"Get student list",
        description:"Get student list",
        security:[
          {
            Bearer:[]
          }
        ]
        ,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  startRoll: { type: "number", example: 1 },
                  endRoll: { type: "number", example: 20 },
                  class: { type: "string", example: "4" },
                  section: { type: "string", example: "A" },
                  shift: { type: "string", example: "Morning" },
                  group: { type: "string", example: "General" },
                  year: { type: "string", example: "2024" }
                }
              }
            }
          }
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
  },
};

module.exports = studentDocs;
