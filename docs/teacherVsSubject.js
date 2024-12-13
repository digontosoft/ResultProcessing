/**
 * @swagger
 * tags:
 *   name: TeacherVsSubject
 *   description: Teacher subject assignment management
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 */

const teacherVsSubjectDocs = {
  paths: {
    "/teacher-subjects": {
      post: {
        tags: ["TeacherVsSubject"],
        summary: "Assign subjects to a teacher",
        description: "Assign multiple subjects and classes to a specific teacher",
        security: [
          {
            "Bearer": []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["teacher_id", "ClassVsSubject"],
                properties: {
                  teacher_id: {
                    type: "string",
                    description: "ID of the teacher",
                    example: "675ab010855007463b917f6e"
                  },
                  ClassVsSubject: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["class_id", "shift", "subjects"],
                      properties: {
                        class_id: {
                          type: "string",
                          description: "ID of the class",
                          example: "6757341c87a347cfc4b367d5"
                        },
                        shift: {
                          type: "string",
                          description: "Shift timing",
                          example: "morning"
                        },
                        subjects: {
                          type: "array",
                          items: {
                            type: "string",
                            description: "Subject IDs",
                            example: "675a80afd9799ba43faa075e"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Subjects successfully assigned to teacher",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true
                    },
                    data: {
                      type: "object",
                      properties: {
                        teacher_id: {
                          type: "string",
                          example: "60d5ecb74d5c3d1b5c5c5c5c"
                        },
                        ClassVsSubject: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              class_id: {
                                type: "string",
                                example: "60d5ecb74d5c3d1b5c5c5c5d"
                              },
                              shift: {
                                type: "string",
                                example: "morning"
                              },
                              subjects: {
                                type: "array",
                                items: {
                                  type: "string",
                                  example: "60d5ecb74d5c3d1b5c5c5c5e"
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
            }
          },
          400: {
            description: "Invalid request data"
          },
          404: {
            description: "Teacher, class or subject not found"
          }
        }
      },
      get: {
        tags: ["TeacherVsSubject"],
        summary: "Get all teacher subject assignments",
        security: [
          {
            "Bearer": []
          }
        ],
        responses: {
          200: {
            description: "List of all teacher subject assignments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      teacher_id: {
                        type: "string",
                        example: "60d5ecb74d5c3d1b5c5c5c5c"
                      },
                      ClassVsSubject: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            class_id: {
                              type: "string",
                              example: "60d5ecb74d5c3d1b5c5c5c5d"
                            },
                            shift: {
                              type: "string",
                              example: "morning"
                            },
                            subjects: {
                              type: "array",
                              items: {
                                type: "string",
                                example: "60d5ecb74d5c3d1b5c5c5c5e"
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
          }
        }
      }
    }
  }
};

module.exports = teacherVsSubjectDocs;
