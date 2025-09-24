# use-google-recaptcha

[![npm version](https://badge.fury.io/js/use-google-recaptcha.svg)](https://badge.fury.io/js/use-google-recaptcha)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React hook for Google reCAPTCHA v3 integration with TypeScript support.

## Features

- 🔐 **Google reCAPTCHA v3** integration
- ⚛️ **React Hook** - Easy to use in functional components
- 📝 **TypeScript** - Full type safety
- 🎯 **Lightweight** - Minimal dependencies
- 🚀 **Modern** - Uses latest React patterns
- 🔧 **Flexible** - Customizable options and actions

## Installation

```bash
# npm
npm install use-google-recaptcha

# yarn
yarn add use-google-recaptcha

# pnpm
pnpm add use-google-recaptcha
```

## Prerequisites

Before using this hook, you need to:

1. Register your site at [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Get your site key for reCAPTCHA v3
3. Add your domain to the reCAPTCHA configuration

## Usage

### Basic Usage

```typescript
import React from 'react';
import { useGoogleReCaptcha } from 'use-google-recaptcha';

function MyComponent() {
  const { execute, executing } = useGoogleReCaptcha({
    key: 'your-recaptcha-site-key'
  });

  const handleSubmit = async () => {
    try {
      const token = await execute('submit');
      console.log('reCAPTCHA token:', token);
      
      // Send token to your backend for verification
      // const response = await fetch('/api/verify-recaptcha', {
      //   method: 'POST',
      //   body: JSON.stringify({ token }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
    } catch (error) {
      console.error('reCAPTCHA error:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={handleSubmit} 
        disabled={executing}
      >
        {executing ? 'Verifying...' : 'Submit'}
      </button>
    </div>
  );
}
```

### Using Environment Variables

You can also use environment variables to store your reCAPTCHA site key:

```typescript
// .env.local (Next.js)
NEXT_PUBLIC_RECAPTHA_SITE_KEY=your-site-key

// .env (Create React App)
REACT_APP_RECAPTHA_SITE_KEY=your-site-key
```

```typescript
import { useGoogleReCaptcha } from 'use-google-recaptcha';

function MyComponent() {
  // The hook will automatically use the environment variable
  const { execute, executing } = useGoogleReCaptcha();
  
  // ... rest of your component
}
```

## API Reference

### `useGoogleReCaptcha(options?)`

#### Parameters

- `options` (optional): Configuration object
  - `key?: string` - Your reCAPTCHA site key. If not provided, will use environment variables
  - `nonce?: string` - Optional nonce for Content Security Policy

#### Returns

An object with the following properties:

- `execute: (action?: string) => Promise<string>` - Function to execute reCAPTCHA
- `executing: boolean` - Whether reCAPTCHA is currently executing

#### Actions

The `execute` function accepts an optional `action` parameter that helps you analyze different user interactions:

```typescript
await execute('login');    // For login forms
await execute('contact');  // For contact forms
await execute('purchase'); // For purchase flows
await execute('search');   // For search functionality
```

## Environment Variables

The hook supports the following environment variables:

- `REACT_APP_RECAPTHA_SITE_KEY` - For Create React App
- `NEXT_PUBLIC_RECAPTHA_SITE_KEY` - For Next.js

## TypeScript Support

This package is written in TypeScript and includes full type definitions. You'll get autocomplete and type checking out of the box.

```typescript
import { useGoogleReCaptcha, IReCaptchaInstance } from 'use-google-recaptcha';

// All types are exported for your convenience
const { execute, executing } = useGoogleReCaptcha();
```

## Backend Verification

Remember to verify the reCAPTCHA token on your backend:

```javascript
// Example Node.js/Express verification
app.post('/api/verify-recaptcha', async (req, res) => {
  const { token } = req.body;
  
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  
  const data = await response.json();
  
  if (data.success && data.score > 0.5) {
    // Token is valid and score is acceptable
    res.json({ success: true });
  } else {
    // Token is invalid or score is too low
    res.status(400).json({ error: 'reCAPTCHA verification failed' });
  }
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Dmitrii Selikhov](https://github.com/idimetrix)

## Links

- [npm package](https://www.npmjs.com/package/use-google-recaptcha)
- [GitHub repository](https://github.com/idimetrix/use-google-recaptcha)
- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)