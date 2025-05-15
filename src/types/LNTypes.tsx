export type LNLink = {
  url: string;
  metaData?: {
    title: string;
    description: string;
    image: string;
  };
  linkData?: {
    time: number;
    category: string;
    catSlug: string;
  };
};
