import { useParams } from 'react-router-dom';

import { useLinkContext } from '../context/LinkContext';
import { CategoryLinkList } from '../components/CategoryLinkList';
import { LinkInputForm } from '../components/LinkInputForm';
import type { LNLink } from '../types/LNTypes';

function LNCategoryPage() {
  /* The useParams() hook returns key-value pairs where key is the parameter name and the value is its value. The catSlug key comes from the respective route. */
  const { catSlug } = useParams();

  const { links, setLinks, handleDelete } = useLinkContext();

  const linkMatch = links.find(l => l.linkData?.catSlug === catSlug);
  
  const category = linkMatch?.linkData?.category ?? "Unknown";

  const handleAddLink = (newLink: LNLink) => setLinks(prev => [...prev, newLink]);

  return (
    <div>
      <h1>Showing links for category: {category}</h1>

      <LinkInputForm
            onSubmit={handleAddLink}
            defaultCategory={category}
            showCategoryInput={false}
        />
            
      <CategoryLinkList
        key={catSlug}
        category={category as string}
        links={links}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default LNCategoryPage;