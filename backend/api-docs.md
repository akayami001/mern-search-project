# API Documentation

## User Routes

### Register a new user

- **Route:** `/api/users/auth/register`
- **Method:** `POST`
- **Request Body:**
  - `name` (string, required): The name of the user.
  - `email` (string, required): The email address of the user.
  - `password` (string, required): The password of the user.
- **Response:**
  - `token` (string): JWT token for authentication.

### Authenticate user and get token

- **Route:** `/api/users/auth/login`
- **Method:** `POST`
- **Request Body:**
  - `email` (string, required): The email address of the user.
  - `password` (string, required): The password of the user.
- **Response:**
  - `token` (string): JWT token for authentication.

### Logout user

- **Route:** `/api/users/logout`
- **Method:** `POST`
- **Response:**
  - `message` (string): Success message indicating that the user has been logged out.

## City Routes

### Create a new city

- **Route:** `/api/cities/`
- **Method:** `POST`
- **Request Body:**
  - `cityName` (string, required): The name of the city.
  - `count` (number, required): The count of the city.
- **Response:**
  - `city` (object): The newly created city object.

### Get all cities

- **Route:** `/api/cities/`
- **Method:** `GET`
- **Response:**
  - `cities` (array): An array of city objects.

### Search cities by name

- **Route:** `/api/cities/search`
- **Method:** `GET`
- **Query Parameters:**
  - `name` (string, required): The name of the city to search for.
  - `page` (number, optional): The page number for pagination (default: 1).
  - `limit` (number, optional): The maximum number of cities per page (default: 5).
- **Response:**
  - `cities` (array): An array of city objects matching the search criteria.
  - `totalPages` (number): The total number of pages for pagination.

### Get city by ID

- **Route:** `/api/cities/:id`
- **Method:** `GET`
- **Request Parameters:**
  - `id` (string, required): The ID of the city.
- **Response:**
  - `city` (object): The city object with the specified ID.

### Update a city

- **Route:** `/api/cities/:id`
- **Method:** `PATCH`
- **Request Parameters:**
  - `id` (string, required): The ID of the city to update.
- **Request Body:**
  - `cityName` (string, optional): The updated name of the city.
  - `count` (number, optional): The updated count of the city.
- **Response:**
  - `city` (object): The updated city object.

### Delete a city

- **Route:** `/api/cities/:id`
- **Method:** `DELETE`
- **Request Parameters:**
  - `id` (string, required): The ID of the city to delete.
- **Response:**
  - `message` (string): Success message indicating that the city has been deleted.
