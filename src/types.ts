export interface EpoOpsConfig {
  apiKey: string;
  baseUrl?: string;
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  maxRetries?: number;
}

export interface EpoOpsResponse {
  status: number;
  data: unknown;
}

export interface OAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface SearchResponse {
  status: number;
  data: {
    query: string;
    results: Array<{
      id: string;
      title: string;
      abstract?: string;
      publicationDate?: string;
    }>;
  };
}

export interface PatentReference {
  type: 'application' | 'priority' | 'publication';
  format: 'docdb' | 'epodoc';
  number: string;
}

export interface BibliographicData {
  title: string;
  abstract: string;
  inventors: string[];
  applicants: string[];
  publicationDate: string;
  applicationDate: string;
  priorityDate?: string;
  classification: string[];
}

export interface Claims {
  independent: string[];
  dependent: string[];
}

export interface FamilyMember {
  publicationNumber: string;
  publicationDate: string;
  title: string;
  abstract?: string;
  country: string;
  kind: string;
}

export interface LegalStatus {
  status: string;
  date: string;
  description: string;
  country: string;
}

export interface SearchOptions {
  range?: string;
  constituent?: 'biblio' | 'full-cycle' | 'abstract';
}

export interface ClassificationOptions {
  ancestors?: boolean;
  navigation?: boolean;
  depth?: '0' | '1' | '2' | '3' | 'all';
}

export interface ClassificationResponse {
  status: number;
  data: {
    class: string;
    title: string;
    description?: string;
    subclasses?: Array<{
      code: string;
      title: string;
      description?: string;
    }>;
  };
}

export interface NumberConversionResponse {
  status: number;
  data: {
    input: {
      type: string;
      format: string;
      number: string;
    };
    output: {
      format: string;
      number: string;
    };
  };
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  tokenEndpoint: string;
  authorizationEndpoint: string;
  scope?: string;
} 
