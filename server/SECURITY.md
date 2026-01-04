# Security Documentation

## API Key Management

### Overview
This application uses AI services (DeepSeek, OpenAI) that require API keys. These keys are sensitive credentials that must be protected.

### Security Measures Implemented

#### 1. Environment Variables
All API keys are stored in environment variables and **never** hardcoded in the source code.

**Required Environment Variables:**
```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=file:./dev.db
STRIPE_SECRET_KEY=your_stripe_key_here
```

#### 2. .gitignore Protection
The `.env` file is excluded from version control via `.gitignore` to prevent accidental commits of sensitive data.

**Never commit:**
- `.env`
- `.env.local`
- `.env.*.local`
- Any files containing API keys or secrets

#### 3. Secure Service Layer
All AI API calls go through a centralized service layer (`server/src/services/aiService.ts`) that:
- Validates API keys are configured before making requests
- Handles API keys internally without exposing them
- Provides error handling without leaking sensitive information
- Implements request validation and sanitization
- Supports rate limiting and timeout controls

#### 4. Controller Security
Controllers (`server/src/controllers/aiController.ts`) use the secure service layer and:
- Never expose API keys in responses
- Validate all user inputs
- Return user-friendly error messages without sensitive details
- Log errors securely without exposing credentials

### Best Practices

#### For Development
1. **Never commit `.env` files** - Always use `.env.example` with placeholder values
2. **Rotate keys regularly** - Change API keys periodically
3. **Use different keys for dev/prod** - Never use production keys in development
4. **Limit key permissions** - Use API keys with minimal required permissions

#### For Production (Vercel)
1. **Set environment variables in Vercel dashboard**
   - Go to Project Settings → Environment Variables
   - Add each variable separately
   - Mark sensitive variables as "Sensitive"
   - Set appropriate environment (Production, Preview, Development)

2. **Never log API keys** - Ensure logging doesn't include sensitive data

3. **Monitor API usage** - Watch for unusual activity that might indicate key compromise

### What to Do If Keys Are Exposed

If API keys are accidentally committed or exposed:

1. **Immediately regenerate the keys** in the respective service dashboards:
   - DeepSeek: https://platform.deepseek.com/api_keys
   - OpenAI: https://platform.openai.com/api-keys
   - Stripe: https://dashboard.stripe.com/apikeys

2. **Update environment variables** with new keys:
   - Local: Update `.env` file
   - Vercel: Update in Project Settings → Environment Variables

3. **Remove from git history** (if committed):
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   # This is complex - consider creating a new repository if needed
   ```

4. **Monitor for unauthorized usage** - Check API usage dashboards for suspicious activity

### API Endpoints

#### Health Check
```
GET /api/ai/health
```
Returns the configuration status of AI providers (does not expose actual keys).

#### Tone Check
```
POST /api/ai/check-tone
Body: { "text": "your text here" }
```
Improves text tone for professional communication.

#### Chat
```
POST /api/ai/chat
Body: { "messages": [{ "role": "user", "content": "message" }] }
```
Chat with Cerebro AI assistant.

### Security Checklist

- [x] API keys stored in environment variables
- [x] `.env` file in `.gitignore`
- [x] Secure service layer implemented
- [x] Input validation on all endpoints
- [x] Error handling without sensitive data exposure
- [x] No API keys in client-side code
- [x] Documentation for secure deployment
- [ ] API keys rotated after exposure
- [ ] Rate limiting implemented (recommended)
- [ ] API usage monitoring (recommended)

### Support

For security concerns or questions, please contact the development team.

**Remember: Security is everyone's responsibility. Always handle API keys with care!**
