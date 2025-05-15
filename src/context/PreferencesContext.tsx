import { createContext, useState, useContext, type ReactNode } from "react";

type CheckPrefs = {
  cardDescription: boolean | undefined;
  cardImages: boolean | undefined;
  saveDate: boolean | undefined;
};

type AllPrefs = {
  linkLimit: number;
  checkPrefs: CheckPrefs,
  sortPref: string
};

const defaultPrefs: AllPrefs = {
    linkLimit: 3,
    checkPrefs: {
        cardImages: true,
        cardDescription: true,
        saveDate: true
    },
    sortPref: "dateDsc"
};

/*
This creates a PreferencesContext that provides two things:

1. prefs: The current user preferences of type AllPrefs (usually from useState)

2. updatePrefs: A function that accepts a *partial* update to prefs.
    The type (newPrefs: Partial<AllPrefs>) => void means:
      - You only need to pass the fields you want to change
      - Internally, this function will likely merge those new fields with the existing prefs,
        then save the result to both React state and localStorage.

In this default context value:
  - prefs is initialized to defaultPrefs so the app has a usable fallback
  - updatePrefs is just a no-op placeholder — an empty function — because we haven’t set the real one yet. The real version will be defined in the <PreferencesProvider> component
    and passed into the context.

Note: We could have defined a PreferencesContextType separately (like in LinkContext),
but it's also valid (if a bit more cramped) to define the shape inline like this.
*/

/*
Unlike `setLinks` in LinkContext which uses React's built-in `Dispatch<SetStateAction<T>>` to update state,
`updatePrefs` here is a custom function we define ourselves. Why? Because we're doing more than just updating
React state — we're also saving the updated preferences to localStorage manually. So instead of using 
`React.Dispatch<React.SetStateAction<AllPrefs>>`, we declare `updatePrefs` as a function that takes 
a `Partial<AllPrefs>` (meaning any subset of preference keys) and returns nothing (`void`).
This gives us full control over what happens during a preference update.

This is why our PreferencesProvider doesn't need a useEffect watching `prefs` — saving is handled directly during the update.
In contrast, LinkContext uses `useState()` and relies on a `useEffect([links])` to persist changes to localStorage after state updates.

That approach works fine for simple state, but when you want full control — like saving immediately during the update —  a custom updater function like `updatePrefs` is the way to go.
*/

const PreferencesContext = createContext<{
  prefs: AllPrefs;
  updatePrefs: (newPrefs: Partial<AllPrefs>) => void;
}>({
  prefs: defaultPrefs,
  updatePrefs: () => {},
});

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [prefs, setPrefs] = useState<AllPrefs>(() => {
    try {
      const saved = localStorage.getItem("formSettings");
      return saved ? JSON.parse(saved) : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  const updatePrefs = (newPrefs: Partial<AllPrefs>) => {
    setPrefs((prev) => {
      const updatedPrefs = {
        ...prev,
        ...newPrefs,
        checkPrefs: {
          ...prev.checkPrefs,
          ...newPrefs.checkPrefs,
        },
      };
      localStorage.setItem("formSettings", JSON.stringify(updatedPrefs));
      return updatedPrefs;
    });
  };

  return (
    <PreferencesContext.Provider value={{ prefs, updatePrefs }}>
      {children}
    </PreferencesContext.Provider>
  );
};
