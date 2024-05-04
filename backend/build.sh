#!/bin/bash

# Build the frontend
cd my-app
npm install
npm run build

# Install backend dependencies
cd ../backend
npm install

# Start the backend server
npm start