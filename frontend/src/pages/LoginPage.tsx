import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material"; // Import Material-UI components
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC<{ handleLogin: () => void }> = ({ handleLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to log in");
      }
      const data = await response.json();
      const { token, role } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setEmail("");
      setPassword("");
      toast.success("Logged in successfully!");
      setTimeout(() => {
        if (role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
        handleLogin();
      }, 2000);
    } catch (error: unknown) {
      toast.error(`Failed to login. Please try again.`);
      console.error("Login error:", error);
    }
  };

  return (
    <Container sx={{ maxWidth: "sm", my: 10 }}>
      <ToastContainer />
      <Typography variant="h4" align="center" gutterBottom>
        Log In
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disableElevation
        >
          Log In
        </Button>
      </form>
    </Container>
  );
};

export default LoginPage;
