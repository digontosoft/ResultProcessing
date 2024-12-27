//result related api documentation

const resultDocs = {
  paths: {
    "/result/create": {
      post: {
        tags: ["Result"],
        summary: "Create a new result",
        description: "Create a new result record",
        security: [
            {
              "Bearer": []
            }
          ],
        requestBody: {
          required: true,
          description: "Result object that needs to be created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  section: {
                    type: "string",
                    example: "A"
                  },
                  className: {
                    type: "string", 
                    example: "9"
                  },
                  subjectName: {
                    type: "string",
                    example: "CSE"
                  },
                  shift: {
                    type: "string",
                    example: "Morning"
                  },
                  session: {
                    type: "string",
                    example: "2024"
                  },
                  term: {
                    type: "string",
                    example: "Final"
                  },
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        subjective: {
                          type: "number",
                          example: 67
                        },
                        objective: {
                          type: "number",
                          example: 18
                        },
                        classAssignment: {
                          type: "number",
                          example: 20
                        },
                        practical: {
                          type: "number",
                          example: 20
                        },
                        studentId: {
                          type: "number",
                          example: 32
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
          "201": {
            description: "Result created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid input"
                    }
                  }
                }
              }
            }
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Unauthorized"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/result/get_all": {
      get: {
        tags: ["Result"],
        summary: "Get all result",
        description: "Get all result",
        security: [
          {
            "Bearer": []
          }
        ],
        responses: {
          200: {
            description: "Result fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Result fetched successfully"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/result/bulk-upload": {
      post: {
        tags: ["Result"],
        summary: "upload bulk result with excel file",
        description: "Create a new result record",
        security: [
            {
              "Bearer": []
            }
          ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file", "section", "className", "subjectName", "shift", "session", "term"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Excel file containing result data"
                  },
                  section: {
                    type: "string",
                    description: "Section name",
                    example: "A"
                  },
                  className: {
                    type: "string", 
                    description: "Class name",
                    example: "9"
                  },
                  subjectName: {
                    type: "string",
                    description: "Subject name",
                    example: "Mathematics"
                  },
                  shift: {
                    type: "string",
                    description: "Class shift",
                    example: "morning"
                  },
                  session: {
                    type: "string",
                    description: "Academic session",
                    example: "2024"
                  },
                  term: {
                    type: "string",
                    description: "Academic term",
                    example: "Final"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Results uploaded successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Results uploaded successfully"
                    },
                    count: {
                      type: "number",
                      example: 40
                    },
                    results: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          studentId: {
                            type: "string",
                            example: "1001"
                          },
                          subjective: {
                            type: "number",
                            example: 40
                          },
                          objective: {
                            type: "number", 
                            example: 25
                          },
                          classAssignment: {
                            type: "number",
                            example: 15
                          },
                          practical: {
                            type: "number",
                            example: 20
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
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No file uploaded"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ,
    "/result/individual": {
      post: {
        tags: ["Result"],
        summary: "Get individual student result",
        description: "Retrieve detailed result for a specific student",
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
                properties: {
                  session: {
                    type: "string",
                    example: "2024"
                  },
                  term: {
                    type: "string",
                    example: "Annual"
                  },
                  className: {
                    type: "string",
                    example: "5"
                  },
                  section: {
                    type: "string",
                    example: "A"
                  },
                  shift: {
                    type: "string",
                    example: "Morning"
                  },
                  studentId: {
                    type: "string",
                    example: "5511"
                  }
                },
                required: ["session", "term", "className", "section", "shift", "studentId"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful operation",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    studentInfo: {
                      type: "object"
                    },
                    results: {
                      type: "array",
                      items: {
                        type: "object"
                      }
                    },
                    summary: {
                      type: "object",
                      properties: {
                        totalMarks: {
                          type: "number"
                        },
                        obtainedMarks: {
                          type: "number"
                        },
                        studentsCount: {
                          type: "number"
                        },
                        gpaWithout4th: {
                          type: "number"
                        },
                        gpa: {
                          type: "number"
                        },
                        remark: {
                          type: "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: "Result not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Result not found"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ,
    "/result/marksheet": {
      post: {
        tags: ["Result"],
        summary: "Get marksheet for a class",
        description: "Retrieve marksheet for a specific class",
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
                properties: {
                  session: {
                    type: "string",
                    example: "2024"
                  },
                  term: {
                    type: "string",
                    example: "Annual"
                  },
                  className: {
                    type: "string",
                    example: "9"
                  },
                  section: {
                    type: "string",
                    example: "A"
                  },
                  shift: {
                    type: "string",
                    example: "Morning"
                  },
                  group: {
                    type: "string",
                    example: "General"
                  },
                  is_merged: {
                    type: "boolean",
                    example: "true"
                  },
                  start_roll: {
                    type: "string",
                    example: "1"
                  },
                  end_roll: {
                    type: "string",
                    example: "2"
                  }
                },
                required: ["session", "term", "className", "section", "shift", "start_roll", "end_roll"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful operation",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    studentInfo: {
                      type: "object"
                    },
                    results: {
                      type: "array",
                      items: {
                        type: "object"
                      }
                    },
                    summary: {
                      type: "object",
                      properties: {
                        totalMarks: {
                          type: "number"
                        },
                        obtainedMarks: {
                          type: "number"
                        },
                        studentsCount: {
                          type: "number"
                        },
                        gpaWithout4th: {
                          type: "number"
                        },
                        gpa: {
                          type: "number"
                        },
                        remark: {
                          type: "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: "Result not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Result not found"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ,
    "/result/tebulation-sheet": {
      post: {
        tags: ["Result"],
        summary: "Get tabulation sheet for a class",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  session: {
                    type: "string",
                    example: "2024"
                  },
                  term: {
                    type: "string",
                    example: "Annual"
                  },
                  className: {
                    type: "string",
                    example: "5"
                  },
                  section: {
                    type: "string",
                    example: "A"
                  },
                  shift: {
                    type: "string",
                    example: "Morning"
                  }
                },
                required: ["session", "term", "className", "section", "shift"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Tabulation sheet retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Tabulation sheet fetched successfully"
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          studentId: {
                            type: "string"
                          },
                          studentName: {
                            type: "string"
                          },
                          subjects: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string"
                                },
                                marks: {
                                  type: "number"
                                },
                                grade: {
                                  type: "string"
                                }
                              }
                            }
                          },
                          totalMarks: {
                            type: "number"
                          },
                          gpa: {
                            type: "number"
                          },
                          grade: {
                            type: "string"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: "No results found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No results found for the given criteria"
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

module.exports = resultDocs;
