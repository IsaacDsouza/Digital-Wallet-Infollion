const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Digital Wallet API",
      version: "1.0.0",
    },
    tags: [
      { name: "Auth", description: "User registration and login" },
      { name: "Admin", description: "Admin operations and reports" },
      { name: "Wallet", description: "Wallet operations (deposit, withdraw, transfer)" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Transaction: {
          type: "object",
          properties: {
            _id: { type: "string" },
            type: { type: "string", enum: ["deposit", "withdraw", "transfer"] },
            from: { type: "string", nullable: true },
            to: { type: "string", nullable: true },
            currency: { type: "string" },
            amount: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            flagged: { type: "boolean" },
            reason: { type: "string", nullable: true },
            deleted: { type: "boolean" }
          },
          example: {
            _id: "6657f835d25c17c3b8a1f0cd",
            type: "withdraw",
            from: "6657f777f2d123456789abcd",
            to: null,
            currency: "USD",
            amount: 1500,
            createdAt: "2024-05-17T02:00:00Z",
            flagged: true,
            reason: "Large withdrawal",
            deleted: false
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], 
};

const specs = swaggerJsdoc(options);

module.exports = function (app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
