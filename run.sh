#!/usr/bin/env bash
# Simple run script for development
echo "Starting backend on http://localhost:8000"
uvicorn backend.app:app --reload --port 8000
