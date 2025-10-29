BookIt: Experiences & Slots
Hey there! This is my take on the Fullstack Intern Assignment – a booking app where you can browse cool travel experiences, pick a date and time slot, fill in your deets, snag a promo if you're lucky, and boom, book it. I had a blast building this, especially nailing the Figma designs on mobile (those grids were a pain at first). Check out the Figma here – I stuck pretty close to it for colors, spacing, and all that jazz.
<img width="1912" height="1030" alt="image" src="https://github.com/user-attachments/assets/8c6511e6-8601-4098-8be1-4f71ff527d02" />
<img width="1919" height="1013" alt="image" src="https://github.com/user-attachments/assets/a4ad84ac-21f3-45a6-8857-05135da4777a" />
<img width="1919" height="1040" alt="image" src="https://github.com/user-attachments/assets/319b69e8-1221-4583-97fc-daf7e92ce439" />


What's the Deal?
The goal was a smooth end-to-end flow: Spot something fun on the home page, dive into details, book a slot without headaches, and get that sweet confirmation. I threw in real validation like checking if a slot's full (no double-books!) and promo codes that actually discount your total. Taxes? Yeah, 6% GST snuck in there too.
It feels snappy on phone, tablet, or desktop – Tailwind made that easy. Data's dynamic: Pulled from the DB, with Unsplash pics for that pro look.

Tech I Used
Frontend

React + TypeScript on Vite (quick hot reloads saved my sanity).
TailwindCSS for styling – matched Figma's yellow buttons and clean cards spot-on.
Hooks for state (useState/useEffect – nothing fancy like Redux).
Fetch for API calls (kept it vanilla).

Backend

Node/Express – just a lightweight server for the APIs.
Supabase for the Postgres DB (love how it handles everything without hassle).
Threw in some checks like unique booking refs and slot updates.

Deployment

Frontend on Vercel (one-click from GitHub).
Backend on Render (free tier works great).
DB lives on Supabase – no local setup nightmares.

How It Flows

Home: Scroll through experiences, search by name or spot. Click "View Details" to jump in.
Details: Big hero image, description, "About" section. Pick a date (shows upcoming ones), then times (multiple per day now – mornings, afternoons, evenings). Adjust quantity, see the price breakdown, hit "Confirm".
Checkout: Quick form for name/email, promo box (try SAVE10 for 10% off). Checkbox for terms, then "Pay and Confirm" – it validates everything server-side.
Confirmation: Green checkmark, your booking ref, and a nudge to explore more.

The whole thing's responsive – stacks nicely on mobile, grids out on bigger screens. Loading states, errors (like "Invalid promo!"), and sold-out badges keep it user-friendly.
Quick API Rundown (what the backend handles):

WhatEndpointDoesList experiencesGET /experiencesGrabs all with latest first.Details + slotsGET /experiences/:idExperience deets plus future slots (filters old dates).Promo checkPOST /promo/validateTakes code + subtotal, spits back discount (or "nah").Book itPOST /bookingsValidates slot, saves booking, bumps the booked count.
Got 11 experiences loaded up (kayaking to stargazing) with 50+ slots – some half-full, some sold out for that real feel.
Getting It Running (Took Me 10 Mins)
First, the DB (Supabase)

Head to supabase.com, make a free project.
In the SQL Editor, paste and run these one by one:

Tables: schema.sql (sets up experiences, slots, etc.).
Basics: sample-data.sql.
More fun: more-experiences.sql.
Slots galore: more-slots.sql (multiple times per date!).


Grab your Project URL and Service Role Key from Settings > API.

Backend

cd backend
npm install (quick).
.env file:
textSUPABASE_URL=your_project_url_here
SUPABASE_SERVICE_KEY=that_long_key
PORT=3001
FRONTEND_URL=http://localhost:5173

npm run dev – fires up on localhost:3001. Test with /experiences in browser.

Frontend

Back to root: npm install.
.env:
textVITE_API_URL=http://localhost:3001

npm run dev – off to localhost:5173. Search, book, done.
