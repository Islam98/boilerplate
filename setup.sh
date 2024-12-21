#!/bin/bash

# Update package lists
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PNPM
curl -fsSL https://get.pnpm.io/install.sh | sh -
export PATH="$HOME/.local/share/pnpm:$HOME/.local/share/pnpm/global/node_modules/.bin:$PATH"

# Verify PNPM installation
pnpm --version || { echo "PNPM installation failed"; exit 1; }

# Initialize the app
npx create-saas-boilerplate myapp3 --skipSystemCheck
