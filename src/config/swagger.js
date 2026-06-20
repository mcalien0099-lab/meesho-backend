const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meesho Backend API",
      version: "1.0.0",
      description: "API documentation for Meesho backend — User & Admin endpoints",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "https://meesho-backend-vert.vercel.app/api",
        description: "Production server"
      },
      {
        url: "http://localhost:5000/api",
        description: "Local development server",
        variables: {
          port: {
            default: "5000",
          },
        },
      },
    ],
    tags: [
      { name: "User", description: "User-related operations" },
      { name: "Admin", description: "Admin-related operations" },
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
  },
  apis: ["./src/routes/*.js"], // scan route files for JSDoc annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
