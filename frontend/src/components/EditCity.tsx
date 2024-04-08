import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface City {
  cityName: string;
  count: number;
}

const EditCity = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState<City>({ cityName: "", count: 0 });

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cities/${cityId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch city");
        }
        const data = await response.json();
        setCity(data);
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    };
    fetchCity();
  }, [cityId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity({ ...city, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //  if the city name is blank
    if (!city.cityName.trim()) {
      toast.error("City name cannot be blank.");
      return;
    }

    // if the count is not a number or negative
    if (isNaN(city.count) || city.count < 0) {
      toast.error("Count must be a non-negative number.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/cities/${cityId}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(city),
        }
      );
      if (response.ok) {
        // City updated successfully
        toast.success("City updated successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(`Error updating city: ${data.message}`);
      }
    } catch (error: unknown) {
      error instanceof Error
        ? toast.error(`Error updating city: ${error}`)
        : toast.error(`Unknown error occurred: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 5 }}>
        <ToastContainer />
        <Typography variant="h5" component="div" sx={{ mb: 3 }}>
          UPDATE CITY
        </Typography>
        <TextField
          placeholder="City Name"
          value={city.cityName} // Handle initial empty state
          onChange={handleChange}
          name="cityName"
          required
        />
        <TextField
          placeholder="count"
          type="number"
          value={city.count} // Handle initial empty state
          onChange={handleChange}
          name="count"
        />
      </Box>
      <Button type="submit" variant="contained" color="primary">
        Update City
      </Button>
    </form>
  );
};

export default EditCity;
