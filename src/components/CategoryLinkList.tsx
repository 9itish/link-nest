import { Link } from 'react-router-dom';

import { normalizeCategory } from '../utils/HelperMethods';
import type { LNLink } from '../types/LNTypes';

import { usePreferences } from "../context/PreferencesContext";

type Props = {
  category: string;
  links: LNLink[];
  onDelete: (index: number) => void;
  limit?: number;
};

function formatTimestampFull(timestamp: number | string): string {
  const date = new Date(timestamp);

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/ (\w{3}) (\d{4})/, ' $1, $2');

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} | ${timePart}`;
}

export function CategoryLinkList({ category, links, onDelete, limit }: Props) {

  const { prefs } = usePreferences();

  let filteredLinks = links
    .filter((link) => link.linkData?.category === category);

   switch (prefs.sortPref) {
    case "titleAsc":
      filteredLinks = filteredLinks.sort((a, b) => a.metaData.title.localeCompare(b.metaData.title));
      break;

    case "titleDsc":
      filteredLinks = filteredLinks.sort((a, b) => b.metaData.title.localeCompare(a.metaData.title));
      break;

    case "dateAsc":
      filteredLinks = filteredLinks.sort(
        (a, b) => (a.linkData?.time ?? 0) - (b.linkData?.time ?? 0)
      );
      break;

    case "dateDsc":
      filteredLinks = filteredLinks.sort(
        (a, b) => (b.linkData?.time ?? 0) - (a.linkData?.time ?? 0)
      );
      break;
  }

    if(limit) {
        filteredLinks = filteredLinks.slice(0, limit);
    }

  return (
    <div>
      {limit && (
        <h2>
            {category} <Link to={`/cat/${normalizeCategory(category)}`}>See All</Link>
        </h2>
      )}
      <ul className="n-flex n-flex-aw-1234">
        {filteredLinks.map((link, i) => (
          <li key={`${category}-${i}`}>
            <div className="link-it-wrap n-card n-bshadow n-round-x5">
              <p>Saved: {link.linkData?.time ? formatTimestampFull(link.linkData.time) : "Unknown"}</p>
              <h3>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.metaData?.title}
                </a>
              </h3>
              { prefs.checkPrefs.cardImages && (
                <img
                className="n-round-x5 s-pad-x2 n-bshadow"
                src={link.metaData?.image}
                alt=""
              />
              )}      
              { prefs.checkPrefs.cardDescription && (
                <p>{link.metaData?.description.substring(0, 160)}...</p>
              )}
              <button
                onClick={() => onDelete(links.indexOf(link))}
                className="n-round-x2"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
