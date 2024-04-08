const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../index.js");

require("dotenv").config();




  describe("GET /api/cities", () => {
    it("should return all cities", async () => {
      const res = await request(app).get("/api/cities");
      console.log("🚀 ~ it ~ request:", app)
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/cities/:id", () => {
    it("should return a city", async () => {
      const res = await request(app).get(
        "/api/cities/66113788ad26aba0168252af"
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Moscow");
    });
  });
  
  describe("POST /api/cities", () => {
    it("should create a city", async () => {
      const res = await request(app).post("/api/cities").send({
        name: "city 2",
        count: 1009,
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("city 2");
    });
  });
  
  describe("PUT /api/cities/:id", () => {
    it("should update a city", async () => {
      const res = await request(app)
        .patch("/api/cities/66113788ad26aba0168252af")
        .send({
          name: "Moscow",
          count: 104,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(104);
    });
  });
  
  describe("DELETE /api/cities/:id", () => {
    it("should delete a city", async () => {
      const res = await request(app).delete(
        "/api/cities/66113788ad26aba0168252af"
      );
      expect(res.statusCode).toBe(200);
    });
  });