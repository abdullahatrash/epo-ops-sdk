# EPO OPS API v3.2 Endpoints Documentation

This document provides a comprehensive overview of the European Patent Office (EPO) Open Patent Services (OPS) REST API endpoints. The API provides access to patent information, bibliographic data, patent content, family information, legal status, and more.

## Base URL

All API requests should be made to the following base URL:

```
https://ops.epo.org/3.2/rest-services
```

## Authentication

The EPO OPS API requires authentication. You need to register on the EPO Developer Portal to obtain credentials. The API uses OAuth 2.0 for authentication.

## Common Parameters

| Parameter | Description |
|-----------|-------------|
| `type` | Reference type (application, priority, publication) |
| `format` | Reference format (docdb, epodoc) |
| `number` | Reference number |
| `q` | Search query |
| `Range` | Range of results to return (e.g., "1-25") |

## Search Services

### Bibliographic Data Search

```
GET /published-data/search
GET /published-data/search/{constituent}
```

#### Parameters:
- `q` (required): Search query (e.g., `ti=plastic`)
- `Range`: Range of elements requested (default: "1-25")
- `constituent`: Constituent part (biblio, full-cycle, abstract)

#### Example:
```
GET /published-data/search?q=ti=electric AND pa=tesla&Range=1-25
GET /published-data/search/biblio?q=ti=battery AND ic=H01M
```

## Published Data Services

### Bibliographic Data Retrieval

```
GET /published-data/{type}/{format}/{number}/biblio
POST /published-data/{type}/{format}/biblio
```

#### Example:
```
GET /published-data/publication/epodoc/EP1000000/biblio
```

### Abstract Retrieval

```
GET /published-data/{type}/{format}/{number}/abstract
POST /published-data/{type}/{format}/abstract
```

#### Example:
```
GET /published-data/publication/epodoc/EP1000000/abstract
```

### Full Cycle Service

```
GET /published-data/{type}/{format}/{number}/full-cycle
POST /published-data/{type}/{format}/full-cycle
```

#### Example:
```
GET /published-data/publication/epodoc/EP1000000/full-cycle
```

### Fulltext Inquiry

```
GET /published-data/{type}/{format}/{number}/fulltext
POST /published-data/{type}/{format}/fulltext
```

#### Example:
```
GET /published-data/publication/epodoc/EP1000000/fulltext
```

### Description Retrieval

```
GET /published-data/{type}/{format}/{number}/description
POST /published-data/{type}/{format}/description
```

#### Example:
```
GET /published-data/publication/epodoc/EP1000000/description
```

### Claims Retrieval

```
GET /published-data/{type}/{format}/{number}/claims
POST /published-data/{type}/{format}/claims
```

#### Example:
```
GET /published-data/publication/epodoc/EP1000000/claims
```

### Equivalents Retrieval

```
GET /published-data/{type}/{format}/{number}/equivalents
POST /published-data/{type}/{format}/equivalents
```

#### Example:
```
GET /published-data/publication/epodoc/EP1000000/equivalents
```

### Images Inquiry and Retrieval

```
GET /published-data/{type}/{format}/{number}/images
POST /published-data/{type}/{format}/images
GET /published-data/images/{image-country}/{image-number}/{image-kind}/{image-type}
POST /published-data/images
```

#### Example:
```
GET /published-data/publication/docdb/EP.1000000.A1/images
GET /published-data/images/EP/1000000/A1/fullimage?Range=1
```

## Family Services

### Family Retrieval

```
GET /family/{type}/{format}/{number}
POST /family/{type}/{format}
```

#### Example:
```
GET /family/publication/epodoc/EP1000000
```

### Family + Bibliographic Data

```
GET /family/{type}/{format}/{number}/biblio
POST /family/{type}/{format}/biblio
```

#### Example:
```
GET /family/publication/epodoc/EP1000000/biblio
```

### Family + Legal Data

```
GET /family/{type}/{format}/{number}/legal
POST /family/{type}/{format}/legal
```

#### Example:
```
GET /family/publication/epodoc/EP1000000/legal
```

## Legal Services

### Legal Data Retrieval

```
GET /legal/{type}/{format}/{number}
POST /legal/{type}/{format}
```

#### Example:
```
GET /legal/publication/epodoc/EP1000000
```

## Register Services

### Register Data Search

```
GET /register/search
GET /register/search/{constituent}
```

#### Parameters:
- `q` (required): Search query (e.g., `ti=plastic`)
- `Range`: Range of elements requested (default: "1-25")
- `constituent`: Constituent part (biblio, events, procedural-steps, upp)

#### Example:
```
GET /register/search?q=ti=battery&Range=1-25
```

### Register Data Retrieval

```
GET /register/{type}/{format}/{number}/biblio
POST /register/{type}/{format}/biblio
```

#### Example:
```
GET /register/publication/epodoc/EP1000000/biblio
```

### Register Events Service

```
GET /register/{type}/{format}/{number}/events
POST /register/{type}/{format}/events
```

#### Example:
```
GET /register/publication/epodoc/EP1000000/events
```

### Register Procedural Steps Service

```
GET /register/{type}/{format}/{number}/procedural-steps
POST /register/{type}/{format}/procedural-steps
```

#### Example:
```
GET /register/publication/epodoc/EP1000000/procedural-steps
```

### Register Unitary Patent Service

```
GET /register/{type}/{format}/{number}/upp
POST /register/{type}/{format}/upp
```

#### Example:
```
GET /register/publication/epodoc/EP1000000/upp
```

## Classification Services

### Classification Schema Service

```
GET /classification/cpc/{class}
GET /classification/cpc/{class}/{subclass}
POST /classification/cpc
```

#### Parameters:
- `class`: CPC class name (e.g., "A01B")
- `subclass`: CPC subclass name (e.g., "00")
- `ancestors`: Boolean flag for including ancestors (false, true)
- `navigation`: Boolean flag for navigation (false, true)
- `depth`: Classification tree traversing depth (0, 1, 2, 3, all)

#### Example:
```
GET /classification/cpc/A01B?depth=2
```

### Classification Media Retrieval Service

```
GET /classification/cpc/media/{media-name}
```

#### Example:
```
GET /classification/cpc/media/1000.gif
```

### Classification Statistics Search Service

```
GET /classification/cpc/search
```

#### Parameters:
- `q` (required): Search query (e.g., `plastic`)

#### Example:
```
GET /classification/cpc/search?q=battery
```

### Classification Mapping Service

```
GET /classification/map/{input-format}/{class}/{subclass}/{output-format}
```

#### Example:
```
GET /classification/map/ecla/A01D2085/8/cpc?additional
```

## Number Services

### Number Service

```
GET /number-service/{type}/{input-format}/{number}/{output-format}
POST /number-service/{type}/{input-format}/{output-format}
```

#### Example:
```
GET /number-service/application/original/JP.(2006-147056).A.20060526/docdb
```

## Advanced Search Query Syntax

The EPO OPS API supports complex queries similar to Espacenet's advanced search. Here's how to construct them:

### Field Codes

- `ti`: Title
- `ab`: Abstract
- `cl`: Claims
- `de`: Description
- `pa`: Applicant/Assignee
- `in`: Inventor
- `pn`: Publication number
- `ap`: Application number
- `pd`: Publication date
- `ad`: Application date
- `pr`: Priority number
- `ic`: International Patent Classification (IPC)
- `cpc`: Cooperative Patent Classification (CPC)

### Operators

- `AND`, `OR`, `NOT`: Boolean operators
- `NEAR`: Words close to each other (default within 5 words)
- `NEAR/n`: Words within n words of each other
- `WITHIN`: Used for date ranges

### Wildcards

- `*`: Multi-character wildcard
- `?`: Single-character wildcard

### Example Queries

1. Title and abstract search:
   ```
   ti=electric AND ab=vehicle
   ```

2. Inventor and date range:
   ```
   in=smith AND pd within "20100101 20201231"
   ```

3. Classification search:
   ```
   cpc=H01M10/0525 AND pa=toyota
   ```

4. Proximity search:
   ```
   ti=solar NEAR/3 battery
   ```

## Response Format

All API responses are in XML format. Successful responses will contain the requested data, while error responses will include fault codes and messages.

### Success Response Example (simplified):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<world-patent-data>
    <!-- Result data here -->
</world-patent-data>
```

### Error Response Example:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<fault>
    <code>string</code>
    <message>string</message>
</fault>
```

## Rate Limits and Quotas

The EPO OPS API has rate limits and usage quotas that vary based on your subscription level. Check your developer account for specific limits.

## Best Practices

1. Use the correct reference format (epodoc, docdb) for patent references
2. Utilize pagination for search results
3. Implement proper error handling
4. Consider caching frequently accessed data
5. Start with simple queries and build up complexity
6. URL encode query parameters properly
