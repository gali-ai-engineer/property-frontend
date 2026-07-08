# Property Research — Frontend

A React frontend for the Property Research API, providing an interface to search London property data, calculate mortgage payments, and compare rental yields across areas.

**Live app:** https://property-frontend-navy.vercel.app/
**Backend API:** https://property-api-rpdk.onrender.com/docs

## Features

- **Property Search** — look up price, rental yield, listings, and growth forecast for a given area
- **Mortgage Calculator** — calculate monthly payments based on area and deposit amount
- **Area Comparison** — compare rental yields and prices across multiple areas at once

## Stack

- React 18 + Vite
- Axios for API requests
- Deployed on Vercel

## Notable engineering details

- **CORS handling**: the frontend and backend are deployed separately (Vercel + Render), requiring explicit CORS middleware configuration on the backend to allow cross-origin requests.
- **Validation & error handling**: every form validates input before submission and displays clear error messages for empty inputs, 404s, and backend validation errors (e.g. negative deposits, deposit exceeding property price).
- **Bug found via manual testing**: an edge case where a validation error would display alongside stale results from a previous successful request — fixed by explicitly clearing result state whenever a new validation error occurs.
- **Responsive design**: layout and typography scale cleanly from mobile (tested at 375px) to desktop.

## Running locally

```bash
npm install
npm run dev
```

## Related

Backend API source: [property-api](https://github.com/gali-ai-engineer/property-api)