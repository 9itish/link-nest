// Why do I need to import BrowserRouter, Routers, and Route

/*
💡 WHAT <BrowserRouter> DOES

<BrowserRouter> is the top-level component that enables routing via the browser's address bar.
It listens to the URL changes (via the History API) and lets <Routes> know what to render.

It’s basically the brain that syncs the URL bar with your React components.

Everything that uses routing — like <Routes>, <Link>, useNavigate, etc. — must live inside it.

✅ Best Practice:
- Wrap your entire app (or at least all your routes) with <BrowserRouter>.
- Don’t stick providers like <PreferencesProvider> or <LinkProvider> inside it unless necessary.
- Keep <BrowserRouter> as a top-level wrapper to keep routing predictable and clean.
*/

/*
💡 WHAT <Routes> DOES

<Routes> is the router's "switchboard":
- It looks at the current URL and renders the BEST matching <Route>.
- "Best" means the most specific match, not just the first one declared.
- If no match is found and no catch-all (*) route exists, nothing renders.

It's not just an array wrapper — it's a smart route selector.

⚠️ You can technically use multiple <Routes> under <BrowserRouter>,
    but for clarity and maintainability, keep a single organized <Routes> block.

✅ Structure your routes cleanly, and let <Routes> figure out the smartest match.
*/

/*
💡 NESTED ROUTES — WHEN & WHY

Nested routes are useful when:
- You have shared layouts (e.g., dashboard with sidebar/header)
- You need to show related views under a parent route (e.g., /blog and /blog/:id)
- You want dynamic content inside a static outer layout

Example:
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="overview" element={<Overview />} />
  <Route path="settings" element={<Settings />} />
</Route>

This structure renders <DashboardLayout /> once, and uses <Outlet /> inside it
to dynamically load Overview or Settings based on the URL.

⚠️ Don’t overuse nesting:
- If routes don’t share layout/state/UI, keep them flat.
- Deep nesting = harder to debug, maintain, and understand.

✅ Best Practice:
- Use shallow nesting only where it actually benefits the structure or UI.
*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LNHomePage from "./pages/HomePage";
import LNCategoryPage from "./pages/LNCategoryPage";
import LNPreferencesPage from "./pages/LNPreferencesPage";
import { LinkProvider } from "./context/LinkContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import Layout from "./components/Layout";

/*
Wrapping the whole app in context providers is usually ideal because:
- It ensures context is available globally across all components.
- It keeps things simple and consistent, avoiding the need to wrap specific routes individually.

However, if you need isolated context or want to optimize performance for specific routes, you can wrap only certain routes with providers:

Example of wrapping a single route with a provider:
<Route 
  path="/preferences" 
  element={
    <PreferencesProvider>
      <LNPreferencesPage />
    </PreferencesProvider>
  }
/>

This way, only the "/preferences" route has access to the PreferencesProvider.

Note: The order of providers doesn’t matter as long as you wrap the app. You can have `PreferencesProvider` as the outermost or `LinkProvider` as the outermost; it doesn't affect functionality.

In general, wrapping the whole app in providers is recommended for most apps as it simplifies management and keeps things scalable.
*/

function App() {
  return (
    <LinkProvider>
      <PreferencesProvider>
        <BrowserRouter>
          <Routes>
            {
              /*
              💡 LAYOUT ROUTE

              This parent <Route> doesn't have a path.
              Instead, it renders the <Layout /> component for all its child routes.

              Inside <Layout />, use <Outlet /> to display the matched child route like LNHomePage, LNCategoryPage, etc.

              ✅ This keeps shared UI (like navbars or footers) in one place without repeating them across routes.
             this  */
            }
            <Route element={<Layout />}>
              <Route path="/" element={<LNHomePage />} />
              <Route path="/cat/:catSlug" element={<LNCategoryPage />} />
              <Route path="/preferences" element={<LNPreferencesPage />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PreferencesProvider>
    </LinkProvider>
  );
}

export default App;
