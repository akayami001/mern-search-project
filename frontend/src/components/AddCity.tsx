import { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const AddCity = () => {
  const [cityName, setCityName] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    if (localStorage.getItem("role") === "user") {
      // If user role is 'user', do nothing (or show a message)
      alert("User does not have permission to edit cities");
      return;
    }
    e.preventDefault();

    // if the city name is blank
    if (!cityName.trim()) {
      setError("City name cannot be blank.");
      return;
    }

    // if the city name contains numbers
    if (/\d/.test(cityName)) {
      setError("City name cannot contain numbers.");
      return;
    }

    //  if the count is not a number or negative
    if (isNaN(count) || count < 0) {
      setError("Count must be a non-negative number.");
      return;
    }

    const token = localStorage.getItem("token");
    const city = { cityName, count };
    const response = await fetch("http://localhost:5000/api/cities/", {
      method: "POST",
      body: JSON.stringify(city),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      toast.error(data.error);
    }
    if (response.ok) {
      setCityName("");
      setCount(0);
      setError(null);
      toast.success("City created successfully!");
    }
  };

  return (
    <Container sx={{ maxWidth: "sm", my: 10 }}>
      <ToastContainer />
      <Typography variant="h5" component="div" sx={{ mb: 3 }}>
        CREATE NEW CITY
      </Typography>
      <form className="create" onSubmit={handleSubmit}>
        <TextField
          placeholder="City Name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          sx={{ my: 3 }}
          placeholder="count"
          type="number"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary">
          Create City
        </Button>
      </form>
      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default AddCity;
