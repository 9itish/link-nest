// Pulling the `useState` hook from React to store and manage state inside functional components.
import { useEffect } from "react";

import { CategoryLinkList } from "../components/CategoryLinkList";
import { useLinkContext } from "../context/LinkContext";

import "../App.css";
import { LinkInputForm } from "../components/LinkInputForm";
import type { LNLink } from "../types/LNTypes";

import { usePreferences } from "../context/PreferencesContext";

// Defining a cusotm type `Link` to use later.

function LNHomePage() {
  // Here I am declaring links as a state variable with initial value as an empty array. Passing `Link[]` means the state will store an array of `Link` objects.
  const { links, setLinks, handleDelete } = useLinkContext();

  const { prefs } = usePreferences();

  useEffect(() => {
    console.log("Saving to localStorage:", JSON.stringify(links));
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  const categories = [...new Set(links.map((link) => link.linkData?.category))];

  return (
    <div>
      <h1>Link Nest</h1>

      <h2>Add Your Link</h2>

      <LinkInputForm
        onSubmit={function (newLink: LNLink): void {
          setLinks([...links, newLink]);
        }}
      />

      <h2>Saved Links</h2>

      {categories.map((cat) => (
        <CategoryLinkList
          key={cat}
          category={cat as string}
          links={links}
          onDelete={handleDelete}
          limit={prefs.linkLimit}
        />
      ))}
    </div>
  );
}

export default LNHomePage;
