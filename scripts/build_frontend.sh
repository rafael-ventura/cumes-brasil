#!/bin/bash
echo "Building frontend on EC2..."

cd /home/ec2-user/cumes-brasil/frontend || exit 1

npm run build

echo "Frontend build completed!"
