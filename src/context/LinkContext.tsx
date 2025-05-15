import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { LNLink } from "../types/LNTypes";

/* 
`setLinks`: A function that updates the `links` state, similar to `useState`'s setter.
It is typed as `React.Dispatch<React.SetStateAction<LNLink[]>>`, meaning it can:
1. Directly accept a new value (`LNLink[]`) to replace the current `links` state.
2. Accept a function that takes the previous state and returns a new state, which is useful for updating the state based on its previous value (e.g., adding, removing, or modifying items in the array).

`React.Dispatch` represents the setter function itself, and `React.SetStateAction<LNLink[]>` defines what type of value or function can be passed to it.

This is the same `setLinks` function created by `useState` in the provider component. Through context, it becomes accessible from any component wrapped in the provider. Also, I can't direclty specify that function here because it is just inaccessible to me outside the component.
*/
type LinkContextType = {
  links: LNLink[];
  setLinks: React.Dispatch<React.SetStateAction<LNLink[]>>;
  handleDelete: (index: number) => void;
};

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const useLinkContext = () => {
  const context = useContext(LinkContext);
  if (!context) {
    throw new Error("useLinkContext must be used within a LinkProvider");
  }
  return context;
};


/*
This function takes a props object and destructures the 'children' key from it, 
which is expected to be a ReactNode (anything React can render). 

The syntax:
  ({ children }: { children: ReactNode }) => { ... }

is just a shorthand for:
  (props: { children: ReactNode }) => {
    const { children } = props;
  }
Any source f
Both versions make 'children' available inside the function scope.
This is commonly used in Context Providers to wrap child components 
and give them access to the context.
*/

/*
In React, any JSX nested between the opening and closing tags of a component
(e.g. <LinkProvider>...</LinkProvider>) is automatically passed as a special prop
called 'children'.

So even if you don't explicitly pass any props to <LinkProvider>,
React internally does this:

  LinkProvider({ children: <PreferencesProvider>...</PreferencesProvider> })

In TypeScript, we type this prop as ReactNode to allow any valid React child:
  type LinkProviderProps = { children: ReactNode }

This is why 'children' is available inside the LinkProvider component —
React handles it under the hood.

Official source:
https://react.dev/reference/react/Children
https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children
*/
export const LinkProvider = ({ children }: { children: ReactNode }) => {
  const [links, setLinks] = useState<LNLink[]>(() => {
    try {
      const saved = localStorage.getItem("links");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse links from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  const handleDelete = (index: number) => {
    setLinks((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <LinkContext.Provider value={{ links, setLinks, handleDelete }}>
      {children}
    </LinkContext.Provider>
  );
};
