import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material"; // Import Material-UI components
import { ToastContainer, toast } from "react-toastify";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to register");
      }
      const data = await response.json();
      const { token, role } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error: unknown) {
      toast.error(`Failed to register. Please try again.`);
      console.error("Registration error:", error);
    }
  };

  return (
    <Container sx={{ maxWidth: "sm", my: 10 }}>
      <ToastContainer />
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disableElevation
        >
          Register
        </Button>
      </form>
      
    </Container>
  );
};

export default RegisterPage;
