# my-brand-web

Fresh React (Vite) implementation of the **Personal website redesign** handoff —
both the public site and the admin Finance Dashboard — wired to the existing
Express/Mongo backend in `../backend`.

## Stack
- React 18 + Vite 5
- react-router-dom 6
- Plain CSS variables for theming (dark / light / system), preserved verbatim
  from the design prototypes (see `src/styles/theme.css`).

## Structure
```
src/
  api/          fetch client + resource mappers (backend → design shapes)
  context/      ThemeProvider, AuthProvider
  components/   ThemeSwitch, Hover (style-hover equivalent)
  lib/          format helpers, constants, pager helper
  site/         public site — SiteLayout, Nav, Footer, Home, BlogList, PostDetail, Auth
  dashboard/    admin — Dashboard shell, Sidebar, TopBar, Modal, Charts,
                useFinance store, derive (finance math), tabs/*
```

## Routes
- `/` public site (hero / about / skills / work / contact)
- `/blog`, `/blog/:id`
- `/login`, `/register`
- `/dashboard` (admin only — requires a logged-in user whose backend `title === "admin"`)

## Running
```bash
# backend (separate terminal, needs MongoDB)
cd ../backend && npm run dev      # serves http://localhost:4500

# this app
npm install
npm run dev                       # http://localhost:3000
```

Set the API base in `.env`:
```
VITE_API_BASE_URL=http://localhost:4500
```

## Data wiring
- Skills / Work / Blog / Messages / Auth use the backend API. The backend models
  were extended additively to carry the design's richer fields (skill `level`,
  work `start`/`end`/`link`, post `excerpt`/`tag`/`body`/`date`, message `read`).
- Finance (transactions, savings contributions, budget items) and Debt
  (borrowed/lent + repayments) use the `/finance` admin API.
- The backend is the single source of truth everywhere — there is **no seed/mock
  fallback**. Empty data renders as empty (each surface has a proper empty state),
  so the UI and any analytics reflect real records only.

## Auth (multi-stage)
The auth screen reproduces the design's stages — **login**, **register → email
verification (OTP)**, **forgot password**, **reset password** — plus a
**Continue with Google** account picker. Backend wiring:
- **Login** → `POST /auth/login`.
- **Register** → `POST /users` (creates the account; the backend also emails a
  verification link). The inline 6-digit step is a demo gate; **Resend** calls
  `GET /users/resend-verification`.
- **Forgot / reset** → `POST /users/request-otp` then `PATCH /users/reset-password`
  with the OTP token (real 6-digit email flow). Falls back to a client-side demo
  code if the backend is unreachable.
- **Google** → the picker is a simulated visitor sign-in (as the design labels it).
  `AuthContext.googleSignIn(account, code)` already accepts a real Google
  authorization `code` → `POST /users/auth/google`; wire Google Identity Services
  + `VITE_GOOGLE_CLIENT_ID` to switch from simulated to real.

## Pagination & search
`lib/pager.js` + `components/Pager.jsx` / `components/SearchInput.jsx` power the
search, topic filters and pagers on the Skills/Work/Blog pages and the dashboard's
Transactions/Blog/Messages/Skills/Work tabs (page sizes match the design).

## Notes
- The legacy CRA app in `../frontend` is left untouched for reference.
- Admin access requires a backend user with `title: "admin"`. The design's demo
  hint (`jimmy@jmt.rw` / `admin123`) only applies if that account exists in your DB.
