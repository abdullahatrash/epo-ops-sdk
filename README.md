# EPO OPS SDK

A TypeScript SDK for the European Patent Office's Open Patent Services (OPS) API with OAuth support.

## Installation

```bash
npm install epo-ops-sdk
```

## Usage

```typescript
import { EpoOpsClient } from 'epo-ops-sdk';

// Initialize the client
const client = new EpoOpsClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
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

- OAuth 2.0 authentication
- Patent search
- Bibliographic data retrieval
- Claims retrieval
- Family member lookup
- Legal status information
- Classification data
- Patent number format conversion
- TypeScript support with full type definitions
- Zod schema validation for responses

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
