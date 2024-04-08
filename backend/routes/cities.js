const express = require("express");
const router = express.Router();
const CityController = require("../controllers/cityController.js");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/", CityController.getAllCities);
router.get("/search", CityController.findCityByName);
router.get("/:id", CityController.getCityById);
router.post("/", verifyToken, CityController.createCity);
router.patch("/:id", verifyToken, CityController.updateCity);
router.delete("/:id", verifyToken, CityController.deleteCity);

module.exports = router;
