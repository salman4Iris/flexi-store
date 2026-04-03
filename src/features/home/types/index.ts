export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  category: string;
  categoryLabel: string;
  icon: string;
  image: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
};

export type StoreFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};
