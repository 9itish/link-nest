import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

/*
We’re using the React Router `<Outlet />` component 
to render child routes inside a parent layout.

- The parent route (e.g., `Layout`) renders a structure that includes common UI elements (like a navbar or sidebar) for its child routes.

- The `<Outlet />` in the parent layout is where the content of the child routes will be injected.

**When no `path` is specified for the parent route**:
- If the parent route doesn't have a `path`, it will render for **all nested routes** regardless of their specific path.
- This means the parent component will always render, and its child routes will be displayed inside the `<Outlet />`.

The key takeaway is that the `<Outlet />` serves as the placeholder in the parent component where child routes can render their content, allowing for a dynamic and reusable layout across different routes.
*/

// What about Multiple Outlet components? This idea is good not that's not how it works. Still interesting concept though.

/*
 * React Router's route matching at a given level:
 * - Identifies all matching routes for the current URL segment.
 * - For matches targeting the *same* <Outlet>, the *most specific* route's component renders.
 * - For matches targeting *different* named <Outlet> components, *all* matching routes render in their respective outlets.
 *
 * Example (/dashboard/profile):
 * <Route path="dashboard" element={<DashboardLayout />}>
 * <Route path="profile" element={<UserProfile />} outlet="main" /> // Matches, renders in 'main'
 * <Route path="*" element={<Goober />} outlet="header" />       // Also matches, renders in 'header'
 * </Route>
 *
 * Example (same outlet):
 * <Route path="dashboard" element={<DashboardLayout />}>
 * <Route path="profile" element={<UserProfile />} outlet="main" /> // More specific, renders in 'main'
 * <Route path="*" element={<Fallback />} outlet="main" />       // Also matches, but less specific, so it doesn't render in 'main'
 * </Route>
*/

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
