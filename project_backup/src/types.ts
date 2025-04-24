import { IconType } from 'react-icons';

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  webp?: string;
  srcSet?: string;
  description: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: IconType;
  price: string;
  features: string[];
}