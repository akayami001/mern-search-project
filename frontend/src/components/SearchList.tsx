import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface City {
  _id: string;
  cityName: string;
  count: number;
}

const SearchList: React.FC = () => {
  const [cityName, setCityName] = useState<string>("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [deleteCityId, setDeleteCityId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const trimmedCityName = cityName.trim();

  // Check if the trimmed cityName is empty
  if (!trimmedCityName) {
    alert("Please enter a valid city name.");
    return;
  }
   
    setSearchResults([]);
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/cities/search?name=${cityName}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSearchResults(data?.cities);
      setCurrentPage(1);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("No results with this parameter. Please try again.");
      toast.error("No results found. Please try again.");
    }
   
  };

  // Handle next page
  const handleNextPage = async () => {
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `http://localhost:5000/api/cities/search?name=${cityName}&page=${nextPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSearchResults(data?.cities);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error fetching next page:", err);
    }
  };

  // Handle previous page
  const handlePrevPage = async () => {
    try {
      const prevPage = currentPage - 1;
      const response = await fetch(
        `http://localhost:5000/api/cities/search?name=${cityName}&page=${prevPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSearchResults(data?.cities);
      setCurrentPage(prevPage);
    } catch (err) {
      console.error("Error fetching next page:", err);
    }
  };

  // Handle editing a city
  const handleEdit = (cityId: string) => {
    if (localStorage.getItem("role") === "user") {
      // If user role is 'user', do nothing (or show a message)
      alert("User does not have permission to edit cities");
      return;
    }
    navigate(`/update/${cityId}`);
  };

  // Handle deleting a city
  const handleDelete = (cityId: string) => {
    if (localStorage.getItem("role") === "user") {
      // If user role is 'user', do nothing (or show a message)
      alert("User does not have permission to delete cities");
      return;
    }
    setDeleteCityId(cityId);
    setShowConfirmModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      // Send a DELETE request to the backend to delete the city
      const response = await fetch(
        `http://localhost:5000/api/cities/${deleteCityId}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        // Remove the deleted city from the search results
        setSearchResults(
          searchResults.filter((city) => city._id !== deleteCityId)
        );
        setShowConfirmModal(false);
        setDeleteCityId(null);
        toast.success("City deleted successfully!");
      } else {
        // Handle error if the request fails
        throw new Error("Failed to delete city");
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      toast.error("Failed to delete city. Please try again.");
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteCityId(null);
    
  };

  return (
    <Box
      sx={{
        display: "flex",
        pt:10,
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
      }}
    >
        <ToastContainer />

      <Typography style={{ margin: "1rem" }} variant="h6">
        Please Type the name of city
      </Typography>

      <form onSubmit={handleSubmit} style={{ margin: "1rem" }}>
        <TextField
          type="text"
          value={cityName}
          onChange={handleChange}
          placeholder="Search City"
          required
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" variant="outlined" sx={{ m: 2 }}>
          Search
        </Button>
      </form>

      {searchResults.length > 0 && (
        <div>
          <List>
            {searchResults.map((city) => (
              <ListItem key={city._id}>
                <ListItemText primary={`${city.cityName} - ${city.count}`} />
                <Button onClick={() => handleEdit(city._id)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button onClick={() => handleDelete(city._id)} color="error">
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
          <div>
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {error && <Typography variant="body1">{error}</Typography>}

      <Modal open={showConfirmModal} onClose={cancelDelete}>
        <Box
          sx={{
            bgcolor: "white",
            p: 3,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">
            Are you sure you want to delete this city?
          </Typography>
          <Button onClick={confirmDelete} variant="contained" sx={{ mr: 1 }}>
            Yes
          </Button>
          <Button onClick={cancelDelete} variant="contained" color="error">
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default SearchList;
