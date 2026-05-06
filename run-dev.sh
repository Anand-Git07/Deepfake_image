#!/usr/bin/env bash
set -e

echo "Start backend:"
echo "  cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver"
echo
echo "Start frontend in another terminal:"
echo "  cd frontend && npm install && npm run dev"
