import axios, { AxiosInstance, AxiosError } from 'axios';
import { withRetry } from './utils/retry';
import { EpoOpsError, AuthenticationError, RateLimitError, ValidationError } from './errors';
import {
  EpoOpsConfig,
  OAuthToken,
  SearchResponse,
  PatentReference,
  BibliographicData,
  Claims,
  FamilyMember,
  LegalStatus,
  SearchOptions,
  ClassificationOptions,
  ClassificationResponse,
  NumberConversionResponse,
} from './types';
import {
  PatentReferenceSchema,
  SearchOptionsSchema,
  ClassificationOptionsSchema,
  BibliographicDataSchema,
  ClaimsSchema,
  FamilyMemberSchema,
  LegalStatusSchema,
  SearchResponseSchema,
  ClassificationResponseSchema,
  NumberConversionResponseSchema,
} from './schemas';
import { z } from 'zod';

export class EpoOpsClient {
  private baseUrl: string;
  private httpClient: AxiosInstance;
  private token: OAuthToken | null = null;
  private maxRetries: number;

  constructor(config: EpoOpsConfig) {
    this.baseUrl = config.baseUrl || 'https://ops.epo.org/3.2';
    this.maxRetries = config.maxRetries || 3;

    // Initialize HTTP client
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.httpClient.interceptors.response.use(
      response => response,
      this.handleError.bind(this)
    );

    // Initialize OAuth client
    this.initializeOAuthClient(config);
  }

  private handleError(error: AxiosError): never {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          throw new AuthenticationError('Invalid or expired token');
        case 403:
          throw new AuthenticationError('Insufficient permissions');
        case 429:
          throw new RateLimitError('Rate limit exceeded');
        case 400:
          throw new ValidationError('Invalid request parameters');
        default:
          throw new EpoOpsError(
            'API request failed',
            status,
            (data as any)?.code,
            data
          );
      }
    }
    throw new EpoOpsError('Network error occurred');
  }

  private async initializeOAuthClient(config: EpoOpsConfig): Promise<void> {
    try {
      // EPO OPS uses a simple OAuth client credentials flow
      const tokenResponse = await axios.post(
        'https://ops.epo.org/3.2/auth/accesstoken',
        new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'ops'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
            'Accept': 'application/json',
            'Connection': 'Keep-Alive',
            'Host': 'ops.epo.org',
            'X-Target-URI': 'http://ops.epo.org'
          }
        }
      );

      if (!tokenResponse.data || !tokenResponse.data.access_token) {
        throw new AuthenticationError('Invalid token response format');
      }

      this.token = {
        access_token: tokenResponse.data.access_token,
        token_type: tokenResponse.data.token_type || 'Bearer',
        expires_in: tokenResponse.data.expires_in || 3600,
        scope: tokenResponse.data.scope
      };
      
      // Update HTTP client with token
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${this.token.access_token}`;
    } catch (error) {
      console.error('OAuth initialization error:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new AuthenticationError(`Failed to initialize OAuth client: ${error.response.data.message || 'Unknown error'}`);
      }
      throw new AuthenticationError('Failed to initialize OAuth client');
    }
  }

  async searchPatents(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    await this.ensureToken();
    return withRetry(
      async () => {
        // Validate options
        SearchOptionsSchema.parse(options);

        const response = await this.httpClient.get('/published-data/search', {
          params: {
            q: query,
            ...options
          }
        });

        const transformedData = this.transformSearchResults(response.data);
        
        // Validate response
        return SearchResponseSchema.parse(transformedData);
      },
      { maxRetries: this.maxRetries }
    );
  }

  async getBibliographicData(reference: PatentReference): Promise<BibliographicData> {
    await this.ensureToken();
    return withRetry(
      async () => {
        // Validate reference
        PatentReferenceSchema.parse(reference);

        const response = await this.httpClient.get(
          `/published-data/${reference.type}/${reference.format}/${reference.number}/biblio`
        );

        const transformedData = this.transformBibliographicData(response.data);
        
        // Validate transformed data
        return BibliographicDataSchema.parse(transformedData);
      },
      { maxRetries: this.maxRetries }
    );
  }

  async getClaims(reference: PatentReference): Promise<Claims> {
    await this.ensureToken();
    return withRetry(
      async () => {
        // Validate reference
        PatentReferenceSchema.parse(reference);

        const response = await this.httpClient.get(
          `/published-data/${reference.type}/${reference.format}/${reference.number}/claims`
        );

        const transformedData = this.transformClaims(response.data);
        
        // Validate transformed data
        return ClaimsSchema.parse(transformedData);
      },
      { maxRetries: this.maxRetries }
    );
  }

  async getFamily(reference: PatentReference): Promise<FamilyMember[]> {
    await this.ensureToken();
    return withRetry(
      async () => {
        // Validate reference
        PatentReferenceSchema.parse(reference);

        const response = await this.httpClient.get(
          `/family/${reference.type}/${reference.format}/${reference.number}`
        );

        const transformedData = this.transformFamilyData(response.data);
        
        // Validate transformed data
        return z.array(FamilyMemberSchema).parse(transformedData);
      },
      { maxRetries: this.maxRetries }
    );
  }

  async getLegalStatus(reference: PatentReference): Promise<LegalStatus[]> {
    await this.ensureToken();
    return withRetry(
      async () => {
        // Validate reference
        PatentReferenceSchema.parse(reference);

        const response = await this.httpClient.get(
          `/legal/${reference.type}/${reference.format}/${reference.number}`
        );

        const transformedData = this.transformLegalStatus(response.data);
        
        // Validate transformed data
        return z.array(LegalStatusSchema).parse(transformedData);
      },
      { maxRetries: this.maxRetries }
    );
  }

  // New API methods

  async getClassification(cpcClass: string, options: ClassificationOptions = {}): Promise<ClassificationResponse> {
    await this.ensureToken();
    return withRetry(
      async () => {
        // Validate options
        ClassificationOptionsSchema.parse(options);

        const response = await this.httpClient.get(`/classification/${cpcClass}`, {
          params: options
        });

        const transformedData = this.transformClassificationData(response.data);
        
        // Validate response
        return ClassificationResponseSchema.parse(transformedData);
      },
      { maxRetries: this.maxRetries }
    );
  }

  async convertNumber(
    type: 'application' | 'priority' | 'publication',
    sourceFormat: 'docdb' | 'epodoc',
    number: string,
    targetFormat: 'docdb' | 'epodoc'
  ): Promise<NumberConversionResponse> {
    await this.ensureToken();
    return withRetry(
      async () => {
        const response = await this.httpClient.get(
          `/number/convert/${type}/${sourceFormat}/${number}/${targetFormat}`
        );

        const transformedData = this.transformNumberConversion(response.data);
        
        // Validate response
        return NumberConversionResponseSchema.parse(transformedData);
      },
      { maxRetries: this.maxRetries }
    );
  }

  async searchClassification(query: string): Promise<ClassificationResponse> {
    await this.ensureToken();
    return withRetry(
      async () => {
        const response = await this.httpClient.get('/classification/cpc/search', {
          params: { q: query }
        });

        // Validate response
        return ClassificationResponseSchema.parse({
          status: response.status,
          data: response.data
        });
      },
      { maxRetries: this.maxRetries }
    );
  }

  private transformBibliographicData(data: any): BibliographicData {
    const doc = data['ops:world-patent-data']['exchange-documents'][0]['exchange-document'];
    const biblio = doc['bibliographic-data'];
    
    return {
      title: biblio['invention-title']['$'],
      abstract: biblio['abstract']?.['$'] || '',
      inventors: biblio.parties?.inventors?.inventor?.map((inv: any) => inv['inventor-name']['$']) || [],
      applicants: biblio.parties?.applicants?.applicant?.map((app: any) => app['applicant-name']['$']) || [],
      publicationDate: biblio['publication-reference']['document-id']['date'],
      applicationDate: biblio['application-reference']['document-id']['date'],
      classification: biblio['patent-classifications']['patent-classification']?.map((pc: any) => 
        `${pc.section}${pc.class}${pc.subclass}`
      ) || []
    };
  }

  private transformClaims(data: any): Claims {
    const claims = data['ops:world-patent-data']['ops:document']['claims']['claim'];
    
    return {
      independent: claims.filter((c: any) => c['@type'] === 'independent').map((c: any) => c['$']),
      dependent: claims.filter((c: any) => c['@type'] === 'dependent').map((c: any) => c['$'])
    };
  }

  private transformFamilyData(data: any): FamilyMember[] {
    const members = data['ops:world-patent-data']['ops:patent-family']['family-member'];
    
    return members.map((member: any) => {
      const docId = member['publication-reference']['document-id'][0];
      return {
        publicationNumber: `${docId.country}${docId['doc-number']}${docId.kind}`,
        publicationDate: docId.date,
        title: member['invention-title']?.['$'] || '',
        country: docId.country,
        kind: docId.kind
      };
    });
  }

  private transformLegalStatus(data: any): LegalStatus[] {
    const events = data['ops:world-patent-data']['ops:legal-status-data']['legal-status'];
    
    return events.map((event: any) => {
      const legalEvent = event['legal-event'];
      return {
        status: legalEvent.code,
        date: legalEvent.date,
        description: legalEvent.title?.['$'] || '',
        country: legalEvent.country
      };
    });
  }

  private transformSearchResults(data: any): SearchResponse {
    const searchData = data['ops:world-patent-data']['ops:biblio-search'];
    const documents = searchData['ops:search-result']['exchange-documents'];
    
    return {
      status: 200,
      data: {
        query: '',
        results: documents.map((doc: any) => {
          const exchangeDoc = doc['exchange-document'];
          const biblio = exchangeDoc['bibliographic-data'];
          return {
            id: `${exchangeDoc['@doc-number']}${exchangeDoc['@kind']}`,
            title: biblio['invention-title']?.['$'] || '',
            abstract: biblio['abstract']?.['$'] || '',
            publicationDate: biblio['publication-reference']['document-id']['date']
          };
        })
      }
    };
  }

  private transformClassificationData(data: any): ClassificationResponse {
    const classData = data['ops:world-patent-data']['ops:classification-data']['classification-item'];
    
    return {
      status: 200,
      data: {
        class: classData['classification-symbol'],
        title: classData['title-part']?.['$'] || '',
        description: classData['description-part']?.['$'] || '',
        subclasses: (classData['child-items'] || []).map((item: any) => ({
          code: item['classification-symbol'],
          title: item['title-part']?.['$'] || ''
        }))
      }
    };
  }

  private transformNumberConversion(data: any): NumberConversionResponse {
    const standardization = data['ops:world-patent-data']['ops:standardization'];
    
    return {
      status: 200,
      data: {
        input: {
          type: standardization.input['@type'],
          format: standardization.input['@format'],
          number: standardization.input['$']
        },
        output: {
          format: standardization.output['@format'],
          number: standardization.output['$']
        }
      }
    };
  }

  private async ensureToken(): Promise<void> {
    if (!this.token) {
      throw new AuthenticationError('OAuth token not initialized');
    }

    if (this.isTokenExpired()) {
      try {
        // Store the current credentials
        const authHeader = this.httpClient.defaults.headers.common['Authorization'];
        const currentConfig = {
          clientId: typeof authHeader === 'string' ? authHeader.split(' ')[1] : '',
          clientSecret: typeof authHeader === 'string' ? authHeader.split(' ')[1] : '',
          baseUrl: this.baseUrl
        };
        await this.initializeOAuthClient(currentConfig);
      } catch (error) {
        throw new AuthenticationError('Failed to refresh OAuth token');
      }
    }
  }

  private isTokenExpired(): boolean {
    if (!this.token) return true;
    // Add a small buffer (5 minutes) to prevent edge cases
    return Date.now() >= (this.token.expires_in * 1000) - 300000;
  }
} 
