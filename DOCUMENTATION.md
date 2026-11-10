# Zivra (Django) — Project Documentation

## 1) Overview
Zivra is a Django-based web application that provides an AI fashion experience. It is organized as a multi-app Django project with separate modules for:
- Landing page
- User authentication (register/login/logout)
- Main dashboard sections: Home, Wardrobe, AI Outfit Review, Grooming, Community

## 2) Tech Stack
- **Backend**: Django (Python)
- **Frontend**: Django templates (HTML) + static assets (CSS/JS/Images)
- **Database**: SQLite (`db.sqlite3`)

## 3) Repository Structure (high level)
Top-level:
- `manage.py` – Django entry point
- `requirements.txt` – Python dependencies
- `db.sqlite3` – SQLite database
- `zivra/` – Django project configuration
- App modules:
  - `landing_pg/` – landing page view/template
  - `accounts/` – authentication views & URL routes
  - `home/` – home dashboard view/template
  - `wardrobe/` – wardrobe dashboard view/template
  - `ai_review/` – AI review page view/template
  - `grooming/` – grooming page view/template
  - `community/` – community page view/template
- Templates:
  - `templates/header.html`, `templates/footer.html`
  - `home/templates/home.html`
  - `ai_review/templates/ai_review.html`
  - `grooming/templates/grooming.html`
  - `wardrobe/templates/wardrobe.html`
  - `community/templates/community.html`
  - `landing_pg/templates/index.html`
  - `accounts/templates/login.html`, `accounts/templates/register.html`

## 4) Django Project Configuration
### 4.1 Settings (`zivra/settings.py`)
Key configuration:
- `DEBUG = True`
- `INSTALLED_APPS` includes all app modules listed above
- `TEMPLATES['DIRS']` points to the top-level `templates/` folder
- Static files:
  - `STATIC_URL = 'static/'`
  - `STATICFILES_DIRS = [BASE_DIR / "static"]`
- Auth redirects:
  - `LOGIN_URL = "/login/"`
  - `LOGIN_REDIRECT_URL = "/home/"`
  - `LOGOUT_REDIRECT_URL = "/login/"`
- Database:
  - SQLite at `BASE_DIR / 'db.sqlite3'`

### 4.2 Root URLConf (`zivra/urls.py`)
Routes configured:
- `/admin/` → Django admin
- `/home/` → `home.urls`
- `/` → `landing_pg.urls`
- `/` → `accounts.urls`
- `/ai-review/` → `ai_review.urls`
- `/community/` → `community.urls`
- `/grooming/` → `grooming.urls`
- `/wardrobe/` → `wardrobe.urls`

## 5) App Modules and Routes
### 5.1 landing_pg
- **View**: `landing_pg/views.py` → `landing(request)`
- **Template**: `landing_pg/templates/index.html`
- **URL**: root (`/`) via `landing_pg/urls.py`

### 5.2 accounts (authentication)
#### URLs (`accounts/urls.py`)
- `register/` → `register_view`
- `login/` → `login_view`
- `logout/` → `logout_view`

#### Views (`accounts/views.py`)
- **register_view**
  - Handles `POST`:
    - Reads `fullname`, `username`, `email`, `password`, `confirm_password`
    - Validates password match
    - Validates username uniqueness
    - Validates email uniqueness
    - Creates a Django `User` via `User.objects.create_user(...)`
    - Stores full name in `user.first_name`
  - Uses Django `messages` framework to show success/errors
  - Redirect behavior: success → redirect to `login`
- **login_view**
  - Handles `POST`:
    - Reads `email`, `password`
    - Locates `User` by email
    - Authenticates using `authenticate(request, username=user_obj.username, password=password)`
    - On success: `login(request, user)` then redirect to `home`
    - On failure: uses `messages.error`
  - Renders `accounts/templates/login.html` for GET
- **logout_view**
  - Calls `django.contrib.auth.logout(request)`
  - Redirects to `login`

> Note: `accounts/views.py` contains an unreachable `return render(request, "register.html")` after a `return redirect("login")`. If this is unintended, it should be cleaned up.

### 5.3 home
- **URL**: `/home/` (from `zivra/urls.py` + `home/urls.py`)
- **View**: `home/views.py` → `home(request)`
- **Template**: `home/templates/home.html`
- **Access control**: `@login_required`

### 5.4 wardrobe
- **URL**: `/wardrobe/`
- **View**: `wardrobe/views.py` → `wardrobe(request)`
- **Template**: `wardrobe/templates/wardrobe.html`
- **Access control**: Not enforced in the provided view (check `wardrobe/views.py`).

### 5.5 ai_review
- **URL**: `/ai-review/`
- **View**: `ai_review/views.py` → `ai_review(request)`
- **Template**: `ai_review/templates/ai_review.html`
- **Access control**: Not enforced in the provided view (check `ai_review/views.py`).

### 5.6 grooming
- **URL**: `/grooming/`
- **View**: `grooming/views.py` → `grooming(request)`
- **Template**: `grooming/templates/grooming.html`
- **Access control**: Not enforced in the provided view (check `grooming/views.py`).

### 5.7 community
- **URL**: `/community/`
- **View**: `community/views.py` → `community(request)`
- **Template**: `community/templates/community.html`
- **Access control**: Not enforced in the provided view (check `community/views.py`).

## 6) Templates & Shared Layout
### 6.1 Shared templates
- `templates/header.html`
  - Contains top navigation UI
  - References static assets (e.g. CSS/JS)
  - Uses `{% url %}` tags for route generation
  - References `request.user.first_name` and `request.user.username`
  - Contains logout link to `{% url 'logout' %}`
- `templates/footer.html`
  - Contains footer UI and static styling

### 6.2 Page templates
Each app has a dedicated template under that app’s `templates/` directory, e.g.:
- `home/templates/home.html`
- `wardrobe/templates/wardrobe.html`
- `ai_review/templates/ai_review.html`
- `grooming/templates/grooming.html`
- `community/templates/community.html`
- `landing_pg/templates/index.html`
- `accounts/templates/login.html`, `accounts/templates/register.html`

## 7) Static Assets
Static content lives in:
- `static/css/*.css`
- `static/js/*.js`
- `static/images/*`

Examples:
- `static/css/main.css`
- `static/css/ai-review.css`
- `static/js/ai-review.js`
- `static/images/hero_model.jpg`

Templates reference them via Django’s `{% load static %}` and `{% static '...' %}`.

## 8) Running the Project
Typical development flow:
1. Install dependencies:
   - `pip install -r requirements.txt`
2. Run migrations (if needed):
   - `python manage.py migrate`
3. Start server:
   - `python manage.py runserver`
4. Open in browser:
   - Landing page: `/`
   - Login: `/login/`
   - Home: `/home/`
   - Other sections: `/wardrobe/`, `/ai-review/`, `/grooming/`, `/community/`

## 9) Known Issues / Notes (from code inspection)
- `accounts/views.py` has unreachable `return render(request, "register.html")` after redirect logic.
- Authentication protection appears only on `home` via `@login_required`.
  - If the other dashboards must also require login, add `@login_required` decorators.

## 10) Next Documentation Improvements (optional)
- Add **sequence diagrams** for authentication and page navigation.
- Document each template’s major UI sections and JS entrypoints.
- Document the data model when/if `models.py` is expanded (currently `accounts/models.py` is empty; app models should be reviewed).

