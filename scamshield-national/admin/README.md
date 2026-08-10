# Admin

The admin panel is currently implemented as the `/admin` route inside
`frontend/` (see `frontend/src/pages/Admin.tsx`), gated by the backend's
`requireRole('admin')` middleware. This folder is reserved for a
standalone admin app if the combined-route approach outgrows the main
frontend later — not needed for Phase 1.
