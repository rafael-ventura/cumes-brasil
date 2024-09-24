#!/bin/bash

echo "Parando o servidor Node.js..."

sudo systemctl stop cumes-backend.service || true
