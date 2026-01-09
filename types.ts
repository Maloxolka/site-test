
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  approved: boolean;
}

export interface SiteDocument {
  id: string;
  title: string;
  fileUrl: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  aboutImage: string;
  contactPhone: string;
  contactAddress: string;
  services: Service[];
  documents: SiteDocument[];
}

export type Section = 'hero' | 'about' | 'services' | 'reviews' | 'contacts' | 'documents';
