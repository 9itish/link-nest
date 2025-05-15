import { useState, type ChangeEvent, type FormEvent } from "react";

import { usePreferences } from "../context/PreferencesContext";

type CheckPrefs = {
  cardDescription: boolean | undefined;
  cardImages: boolean | undefined;
  saveDate: boolean | undefined;
};

type LocalPrefs = {
  linkLimit: number,
  checkPrefs: CheckPrefs,
  sortPref: string
}

const defaultPrefs: LocalPrefs = {
    linkLimit: 3,
    checkPrefs: {
        cardImages: true,
        cardDescription: true,
        saveDate: true
    },
    sortPref: "dateDsc"
};

function LNPreferencesPage() {
  const { prefs, updatePrefs } = usePreferences();

  const [ localPrefs, setLocalPrefs ] = useState<LocalPrefs>(() => {
      const savedRaw = localStorage.getItem("formSettings");

      if(savedRaw) {
        const saved = JSON.parse(savedRaw);

        return {...defaultPrefs, ...saved, checkPrefs: {...defaultPrefs.checkPrefs, ...saved.checkPrefs}}
      } else {
        return defaultPrefs;
      }

  });

  if (!prefs) {
    return <div>Preferencesdid not load...</div>;
  }


  function updateLinkLimit(event: ChangeEvent<HTMLInputElement>): void {

    const linkLimit = Math.max(1, Number(event.target.value));

    setLocalPrefs(prev => ({
      ...prev,
      linkLimit: linkLimit,
    }));
  }

  function updateSortPref(event: ChangeEvent<HTMLInputElement>): void {

    const sortPref = event.target.value;

    setLocalPrefs(prev => ({
      ...prev,
      sortPref: sortPref,
    }));
  }

  function updateCheckboxPrefs(event: ChangeEvent<HTMLInputElement>): void {
    
    const { name, checked } = event.target;

    setLocalPrefs(prev => ({
      ...prev,
      checkPrefs: {
        ...prev.checkPrefs,
        [name]: checked,
      },
    }));
    
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    updatePrefs(localPrefs);


  }

  return (
    <div>
      <h1>Link Nest Preferences</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="link">
            How many links should I show on the homepage per category?
          </label>
          <input
            className="n-round"
            value={localPrefs.linkLimit}
            type="number"
            onChange={updateLinkLimit}
            placeholder="3"
          />
        </div>

        <h3>Card Preferences</h3>

        <div className="form-group">
          <label htmlFor="link">
            <input
              className="n-round"
              name="cardImages"
              type="checkbox"
              checked={localPrefs.checkPrefs.cardImages}
              onChange={updateCheckboxPrefs}
            />{" "}
            Show images in cards.
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="link">
            <input
              className="n-round"
              name="cardDescription"
              type="checkbox"
              checked={localPrefs.checkPrefs.cardDescription}
              onChange={updateCheckboxPrefs}
            />{" "}
            Show description in cards.
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="link">
            <input
              className="n-round"
              name="saveDate"
              type="checkbox"
              checked={localPrefs.checkPrefs.saveDate}
              onChange={updateCheckboxPrefs}
            />{" "}
            Show "Save Date" in cards.
          </label>
        </div>

        <div className="form-group">
          <fieldset>
            <legend>Sort Posts</legend>
            <label>
              <input
                type="radio"
                name="sortBy"
                value="titleAsc"
                checked={localPrefs.sortPref === "titleAsc"}
                onChange={updateSortPref}
              />
              Title (A-Z)
            </label>
            <label>
              <input
                type="radio"
                name="sortBy"
                value="titleDsc"
                checked={localPrefs.sortPref === "titleDsc"}
                onChange={updateSortPref}
              />
              Title (Z-A)
            </label>
            <label>
              <input
                type="radio"
                name="sortBy"
                value="dateAsc"
                checked={localPrefs.sortPref === "dateAsc"}
                onChange={updateSortPref}
              />
              Date (Oldest-Latest)
            </label>
            <label>
              <input
                type="radio"
                name="sortBy"
                value="dateDsc"
                checked={localPrefs.sortPref === "dateDsc"}
                onChange={updateSortPref}
              />
              Date (Latest-Oldest)
            </label>
          </fieldset>
        </div>

        <button type="submit" className="n-btn bgh-azure">
          Submit
        </button>
      </form>
    </div>
  );
}

export default LNPreferencesPage;
