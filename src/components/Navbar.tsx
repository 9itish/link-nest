import { NavLink } from "react-router-dom";

/*
NavLink:
- React Router's version of <a>, used for navigation without page reloads.
- Automatically applies "active" styling when its `to` matches the current URL.

About `end`:
- Optional prop that enforces exact matching when you're linking to parent paths.
- Without `end`, a NavLink to "/settings" will ALSO be active on visting "/settings/profile".
- With `end`, it only matches exactly "/settings" — and nothing beyond.

<NavLink to="/"> is an exceptional case because every URL matches /. To avoid this matching every single route by default, it effectively ignores the end prop and only matches when you're at the root route.

Summary:
- You probably don't need `end` for root-level routes like "/".
- You DO need it for routes that are parents of other nested routes.
*/

export default function Navbar() {
  return (
    <nav className="n-navigation tc-azure">
    
      <div className="n-navlink-group">
      <ol><li><NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "tc-green" : ""
        }
      >
        Home
      </NavLink></li>
      <li>
      <NavLink
        to="/preferences"
        className={({ isActive }) =>
          isActive ? "tc-green" : ""
        }
      >
        Preferences
      </NavLink>
      </li>
      </ol>
      </div>
    </nav>
  );
}
