# Highway Delite — Experiences & Slot Booking

Hi — this is my Full-Stack intern assignment: a small booking app where users browse curated travel experiences, pick a date + time slot, apply a promo, and book. I built the UI from my Figma designs and implemented a simple backend to make bookings actually work.


<img width="1912" height="1030" alt="image" src="https://github.com/user-attachments/assets/8c6511e6-8601-4098-8be1-4f71ff527d02" />
<img width="1919" height="1013" alt="image" src="https://github.com/user-attachments/assets/a4ad84ac-21f3-45a6-8857-05135da4777a" />
<img width="1919" height="1040" alt="image" src="https://github.com/user-attachments/assets/319b69e8-1221-4583-97fc-daf7e92ce439" />


## Quick summary
- Browse experiences (kayaking, stargazing, etc.)  
- Pick a date and a time slot (slots are capacity-limited)  
- Apply promo codes (try `SAVE10`) and see GST applied  
- Book and get a booking reference on success  
- Responsive UI — works on phone, tablet, and desktop

---

## Why I built it this way
I wanted a clean end-to-end flow that felt real: dynamic data, slot availability checks, server-side validation, and a tidy booking confirmation. The goal was to match the Figma layout closely while keeping the code simple and readable.

---

## Tech stack
**Frontend:** React + TypeScript (Vite), TailwindCSS  
**Backend:** Node + Express  
**Database:** Supabase (Postgres)  
**Hosting:** Frontend on Vercel, Backend on Render, DB on Supabase

(Figma link: _paste your Figma URL here_)

---

## What’s included
- 11 sample experiences + many sample slots (some full, some partial)  
- Promo validation endpoint (`/promo/validate`)  
- Booking endpoint (`/bookings`) that updates slot counts and returns a unique ref  
- Search on home, detail view with images, checkout flow with form validation

---

## API overview
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/experiences` | List experiences |
| GET | `/experiences/:id` | Experience details + upcoming slots |
| POST | `/promo/validate` | Returns discount if code is valid |
| POST | `/bookings` | Creates a booking, updates slot counts |

---

## Run locally (quick)
### 1. Supabase
- Create a free Supabase project and run the SQL files in `/db` (schema + sample data).
- Get the `PROJECT_URL` and `SERVICE_ROLE_KEY`.

### 2. Backend
cd backend

npm install

node server.js

### 3. frontend

cd frontend

npm install

npm run dev



