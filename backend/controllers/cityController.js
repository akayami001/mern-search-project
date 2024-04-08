const City = require("../models/cityModel.js");

const CityController = {
  // Create a new City
  createCity: async (req, res) => {
    try {
      const { cityName, count } = req.body;

      // Validate cityName and count here
      const newCity = new City({
        cityName,
        count,
      });

      const savedCity = await newCity.save();
      console.log(savedCity._id);
      res.status(201).json(savedCity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all Cities
  getAllCities: async (req, res) => {
    try {
      const cities = await City.find();
      res.json(cities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  //get city by search query
  findCityByName: async (req, res) => {
    try {
      const cityName = req.query.name;
      const query = { cityName: { $regex: cityName, $options: "i" } };
      // Pagination
      const page = parseInt(req.query.page) || 1;
      console.log("🚀 ~ findCityByName: ~ page:", page)
      const pageSize = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * pageSize;
      console.log("🚀 ~ findCityByName: ~ skip:", skip)
      
      const cities = await City.find(query).skip(skip).limit(pageSize);

      const total = await City.countDocuments(query);
      console.log("🚀 ~ findCityByName: ~ total:", total)
      const totalPages = Math.ceil(total / pageSize);
      if (!cities.length) {
        return res.status(404).json({ message: "No city found" });
      }

      res.json({ cities, totalPages });
    } catch (error) {
      res.status(500).json({ message: "Error fetching cities" });
    }
  },
  // Controller to get a city by ID
  getCityById: async (req, res) => {
    const cityId = req.params.id; // Extract the city ID from the request parameters

    try {
      const city = await City.findById(cityId); // Find the city by its ID
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.status(200).json(city); // Return the city data
    } catch (error) {
      console.error("Error fetching city by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update a City
  updateCity: async (req, res) => {
    const cityId = req.params.id;
    try {
      const { cityName, count } = req.body;

      const updatedCity = await City.findByIdAndUpdate(
        cityId,
        { cityName, count },
        { new: true }
      );

      if (!updatedCity) {
        return res.status(404).json({ message: "City not found" });
      }

      res.json(updatedCity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a City
  deleteCity: async (req, res) => {
    const cityId = req.params.id;
    try {
      const deletedCity = await City.findByIdAndDelete(cityId);

      if (!deletedCity) {
        return res.status(404).json({ message: "City not found" });
      }

      res.json({ message: "City deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = CityController;
