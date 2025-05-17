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
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], 
};

const specs = swaggerJsdoc(options);

module.exports = function (app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
