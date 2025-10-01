# Laravel + React (Vite) — TaskBoard

**Stack**
- Backend: Laravel 10 (API-only) — configured for **MySQL**
- Frontend: React + Vite + TailwindCSS
- Auth: Laravel Sanctum (instructions included)
- Drag & Drop: react-beautiful-dnd

Follow the steps in **Backend** and **Frontend** sections to run locally.

---

## Quick setup (Linux / macOS)

### 1) Backend
```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Copy env and set DB credentials (MySQL)
cp .env.example .env
# Edit .env: set DB_DATABASE, DB_USERNAME, DB_PASSWORD to your MySQL

php artisan key:generate

# 3. Run migrations and seed example data
php artisan migrate --seed

# 4. Run dev server
php artisan serve --host=127.0.0.1 --port=8000
```

Laravel Sanctum:
- Install sanctum (`composer require laravel/sanctum`) and follow docs to enable if needed.
- This skeleton expects you to run `composer install` and then install sanctum as above.

### 2) Frontend
```bash
cd ../frontend
npm install
# Update .env to point to backend API (default: http://127.0.0.1:8000)
npm run dev
```

Open the frontend dev server (Vite) URL shown in the console (usually http://localhost:5173).