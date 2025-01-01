# Project Setup and API Usage

## Prerequisites

To run this project, first create a `.env` file in the root folder and copy the contents from `.env.sample`.

## Running the Project

The project can be run in two different ways:

### 1. Using Docker

To run the project using Docker, execute the following command:

```sh
docker-compose up --build
```

### 2. Running Locally

To run the project locally, follow these steps:

##### 1. Install dependencies:
```sh
yarn install
```

##### 2. Start the development server:
```sh
yarn run start\:dev
```
## Creating a Super User

To create a super user, run the following command:

```sh
npx ts-node prisma/seed.ts
```
After successfully seeding the super user, you can log in using the super user credentials:
```json
{
  "username": "superadmin",
  "password": "SuperAdmin123"
}
```
## API Endpoints

### Authentication Routes

#### User Registration

- **Endpoint:** `/api/auth/register`
- **Method:** POST
- **Body:**

    ```json
    {
      "username": "string",
      "password": "string",
      "email": "string",
      "fullName": "string"
    }
    ```
### User Registration

- **Endpoint:** `/api/auth/register`
- **Method:** POST
- **Body:**

    ```json
    {
      "username": "string",
      "password": "string",
      "email": "string",
      "fullName": "string"
    }
    ```

- **Notes:**
    - `email` and `fullName` are optional.
    - `username` must be unique.
    - `password` must contain at least one uppercase letter, one lowercase letter, one numerical character, and one special character.
    - `email` must be unique.

### User Login

- **Endpoint:** `/api/auth/login`
- **Method:** POST
- **Body:**

    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
## Post Routes

### 1. Get All Posts

- **Endpoint:** `/api/posts`
- **Method:** GET
- **Notes:** This endpoint is accessible to anyone.

### 2. Create a Post

- **Endpoint:** `/api/posts`
- **Method:** POST
- **Body:**

    ```json
    {
      "title": "string",
      "content": "string"
    }
    ```

- **Notes:** This is a protected route. Users must be logged in to create a post.

### 3. Get a Single Post
- **Endpoint:** `/api/posts/{id}`
- **Method:** `GET`
- **Notes:** This endpoint is accessible to anyone.

### 4. Comment on a Post

- **Endpoint:** `/api/posts/{postId}/comments`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "content": "string"
  }
  ```
### 5. Get Post Comments

- **Endpoint:** `/api/posts/{postId}/comments`
- **Method:** `GET`
- **Notes:** This endpoint is accessible to anyone.

### 6. Upload Post Image

- **Endpoint:** `/api/posts/{postId}/image`
- **Method:** `POST`
- **Notes:** Only the author of the post can upload a single image. Valid formats are jpg, jpeg, and png.

### 7. Delete Post Image

- **Endpoint:** `/api/posts/{postId}/image`
- **Method:** `DELETE`
- **Notes:** Only the author of the post can delete the image.

### 8. Edit a Post

- **Endpoint:** `/api/posts/{postId}`
- **Method:** `PATCH`
- **Notes:** Users must be logged in to edit their post.

### 8. Delete a Post

- **Endpoint:** `/api/posts/{postId}`
- **Method:** `DELETE`
- **Notes:** Users can delete their own posts.

## Role-based Access Control

### Super User Role

- Only **super users (admin)** have the permission to edit the profiles of other users.
- The route `PATCH /api/users/profile` is restricted to super users for this specific action.
