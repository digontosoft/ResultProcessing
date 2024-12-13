/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Teacher management APIs
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teacher]
 *     responses:
 *       200:
 *         description: A list of teachers
 */
const teacherDocs = {
    paths: {
      "/teachers": {
        get: {
          tags: ["Teacher"],
          summary: "Get all teachers",
          responses: {
            200: {
              description: "A list of teachers",
            },
          },
        },
      },
    },
  };
  
  module.exports = teacherDocs;
  