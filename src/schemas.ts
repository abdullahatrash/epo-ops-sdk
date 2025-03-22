import { z } from 'zod';

export const PatentReferenceSchema = z.object({
  type: z.enum(['application', 'priority', 'publication']),
  format: z.enum(['docdb', 'epodoc']),
  number: z.string()
});

export const SearchOptionsSchema = z.object({
  range: z.string().optional(),
  constituent: z.enum(['biblio', 'full-cycle', 'abstract']).optional()
});

export const ClassificationOptionsSchema = z.object({
  ancestors: z.boolean().optional(),
  navigation: z.boolean().optional(),
  depth: z.enum(['0', '1', '2', '3', 'all']).optional()
});

export const BibliographicDataSchema = z.object({
  title: z.string(),
  abstract: z.string(),
  inventors: z.array(z.string()),
  applicants: z.array(z.string()),
  publicationDate: z.string(),
  applicationDate: z.string(),
  priorityDate: z.string().optional(),
  classification: z.array(z.string())
});

export const ClaimsSchema = z.object({
  independent: z.array(z.string()),
  dependent: z.array(z.string())
});

export const FamilyMemberSchema = z.object({
  publicationNumber: z.string(),
  publicationDate: z.string(),
  title: z.string(),
  abstract: z.string().optional(),
  country: z.string(),
  kind: z.string()
});

export const LegalStatusSchema = z.object({
  status: z.string(),
  date: z.string(),
  description: z.string(),
  country: z.string()
});

export const SearchResponseSchema = z.object({
  status: z.number(),
  data: z.object({
    query: z.string(),
    results: z.array(z.object({
      id: z.string(),
      title: z.string(),
      abstract: z.string().optional(),
      publicationDate: z.string().optional()
    }))
  })
});

export const ClassificationResponseSchema = z.object({
  status: z.number(),
  data: z.object({
    class: z.string(),
    title: z.string(),
    description: z.string().optional(),
    subclasses: z.array(z.object({
      code: z.string(),
      title: z.string(),
      description: z.string().optional()
    })).optional()
  })
});

export const NumberConversionResponseSchema = z.object({
  status: z.number(),
  data: z.object({
    input: z.object({
      type: z.string(),
      format: z.string(),
      number: z.string()
    }),
    output: z.object({
      format: z.string(),
      number: z.string()
    })
  })
}); 
