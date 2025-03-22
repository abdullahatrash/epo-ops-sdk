# EPO OPS SDK

A TypeScript SDK for the European Patent Office's Open Patent Services (OPS) API with OAuth support.

## Installation

```bash
npm install epo-ops-sdk
```

## Authentication

The SDK uses OAuth 2.0 client credentials flow for authentication. You need to:

1. Register at the [EPO OPS website](https://developers.epo.org/) to get your credentials
2. Create a `.env` file in your project root with your credentials:
   ```
   EPO_CLIENT_ID=your_client_id
   EPO_CLIENT_SECRET=your_client_secret
   ```

### Authentication Requirements

- Valid client ID and client secret from EPO OPS
- Proper headers including:
  - Content-Type: application/x-www-form-urlencoded
  - Accept: application/json
  - Connection: Keep-Alive
  - Host: ops.epo.org
  - X-Target-URI: http://ops.epo.org

## Usage

```typescript
import { EpoOpsClient } from 'epo-ops-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the client
const client = new EpoOpsClient({
  clientId: process.env.EPO_CLIENT_ID,
  clientSecret: process.env.EPO_CLIENT_SECRET
});

// Search for patents
const searchResults = await client.searchPatents('TI=(artificial intelligence)');

// Get bibliographic data
const biblio = await client.getBibliographicData({
  type: 'publication',
  format: 'docdb',
  number: 'EP1234567A1'
});

// Get patent claims
const claims = await client.getClaims({
  type: 'publication',
  format: 'docdb',
  number: 'EP1234567A1'
});

// Get patent family members
const family = await client.getFamily({
  type: 'publication',
  format: 'docdb',
  number: 'EP1234567A1'
});

// Get legal status
const legalStatus = await client.getLegalStatus({
  type: 'publication',
  format: 'docdb',
  number: 'EP1234567A1'
});

// Get classification details
const classification = await client.getClassification('G06F', {
  ancestors: true,
  navigation: true,
  depth: 'all'
});

// Convert patent numbers between formats
const converted = await client.convertNumber(
  'publication',
  'docdb',
  'EP1234567A1',
  'epodoc'
);
```

## Features

- OAuth 2.0 authentication with automatic token refresh
- Patent search
- Bibliographic data retrieval
- Claims retrieval
- Family member lookup
- Legal status information
- Classification data
- Patent number format conversion
- TypeScript support with full type definitions
- Zod schema validation for responses

## Error Handling

The SDK includes comprehensive error handling for common issues:

- `AuthenticationError`: When there are issues with OAuth authentication
- `RateLimitError`: When API rate limits are exceeded
- `ValidationError`: When request parameters are invalid
- `EpoOpsError`: For general API errors

## Troubleshooting

If you encounter authentication issues:

1. Verify your credentials are correct in the `.env` file
2. Check that your client ID and secret are properly formatted (no extra spaces)
3. Ensure you have the correct permissions for the OPS API
4. Verify your network connection to ops.epo.org
5. Check if your credentials have expired

## API Documentation

For detailed API documentation, please refer to [OPS.md](OPS.md).

## Requirements

- Node.js >= 16.15.1
- TypeScript >= 4.5.0 (for development)

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 
