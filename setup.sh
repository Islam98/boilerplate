#!/bin/bash

# Update package lists
# sudo apt update

# Install Docker
sudo sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Node.js
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PNPM
sudo npm install -g pnpm && pnpm install && pnpm build

# Initialize the app
npm init saas-boilerplate myapp3
