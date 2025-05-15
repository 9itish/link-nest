import { useState, type ChangeEvent, type FormEvent } from "react";
import type { LNLink } from "../types/LNTypes";
import { normalizeCategory } from "../utils/HelperMethods";
import { useLinkContext } from "../context/LinkContext";

type Props = {
  defaultCategory?: string;
  showCategoryInput?: boolean;
  onSubmit: (newLink: LNLink) => void;
};


export function LinkInputForm({ defaultCategory = "", showCategoryInput = true, onSubmit }: Props) {

  const [url, setUrl] = useState("");
  const [category, setCategory] = useState(defaultCategory);

  const updateUrl = (e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);
  const updateCategory = (e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value);

  const {links} = useLinkContext();

  const fetchMetaData = async (url: string) => {
    try {
      const res = await fetch(`http://hellonitish.com/link-nest/meta.php?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanURL = url.trim();
    if (!cleanURL || !category.trim()) return;

    const normalizeURL = (url: string) => new URL(url).href.toLowerCase();

    if (links.some(link => normalizeURL(link.url) === normalizeURL(cleanURL))) {
      alert('Link already saved!');
      return;
    }

    const metaData = await fetchMetaData(cleanURL);
    if (!metaData) {
      alert("Couldn't fetch metadata. Try again later.");
      return;
    } 

    const newLink: LNLink = {
      url: cleanURL,
      metaData,
      linkData: {
        time: Date.now(),
        category,
        catSlug: normalizeCategory(category),
      },
    };

    onSubmit(newLink);
    setUrl("");
    if (showCategoryInput) setCategory("");
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="link">Your Link</label>
            <input
                className="n-round"
                value={url}
                type="url"
                id="link"
                onChange={updateUrl}
                placeholder="https://www.example.com"
            />
        </div>
        {showCategoryInput && (
            <div className="form-group">
                <label htmlFor="category">Link Category</label>
                <input
                className="n-round"
                value={category}
                type="text"
                id="category"
                onChange={updateCategory}
                placeholder="Category"
                />
            </div>
        )}
      <button type="submit" className="n-btn bgh-azure">Submit</button>
    </form>
  );
}
