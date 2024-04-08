const City = require("../models/cityModel.js");

const CityController = {
  // @desc    Create a new city
  // @route   POST /api/cities
  // @access  Public
  createCity: async (req, res) => {
    try {
      const { cityName, count } = req.body;

      // Validate cityName and count here
      const newCity = new City({
        cityName,
        count,
      });

      const savedCity = await newCity.save();
      res.status(201).json(savedCity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Retrieve all cities from the database
  // GET /api/cities
  // Public access
  getAllCities: async (req, res) => {
    try {
      const cities = await City.find();
      res.json(cities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Search for cities by name
  // GET /api/cities/search?name={cityName}&page={pageNumber}&limit={pageSize}
  // Public access
  findCityByName: async (req, res) => {
    try {
      const cityName = req.query.name;
      const query = { cityName: { $regex: cityName, $options: "i" } };
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * pageSize;

      const cities = await City.find(query).skip(skip).limit(pageSize);

      const total = await City.countDocuments(query);
      const totalPages = Math.ceil(total / pageSize);
      if (!cities.length) {
        return res.status(404).json({ message: "No city found" });
      }

      res.json({ cities, totalPages });
    } catch (error) {
      res.status(500).json({ message: "Error fetching cities" });
    }
  },

  // Retrieve a city by its ID
  // GET /api/cities/:id
  // Public access
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

  // Update an existing city in the database
  // PUT /api/cities/:id
  // Public access
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

  // Delete a city from the database
  // DELETE /api/cities/:id
  // Public access
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
