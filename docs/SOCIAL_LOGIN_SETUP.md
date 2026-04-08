# Social Login Implementation Guide

This guide explains how to set up and use Google and LinkedIn OAuth integration in the flexi-store application.

## Features

- ✅ Google OAuth login
- ✅ LinkedIn OAuth login  
- ✅ Email-based user identification
- ✅ JWT token management
- ✅ Session persistence

## Installation

next-auth has been installed. All necessary files have been created.

```bash
npm install next-auth --legacy-peer-deps
```

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the project root with your OAuth credentials:

```env
# GOOGLE OAUTH
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# LINKEDIN OAUTH
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# NEXTAUTH CONFIG
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_generate_with_openssl_rand_hex_32
```

### 2. Get OAuth Credentials

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google+ API
4. Go to **Credentials** → **Create OAuth 2.0 credentials** (Web application)
5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Copy **Client ID** and **Client Secret**
7. Add them to your `.env.local`

#### LinkedIn OAuth Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Create a new app
3. In **Auth** section:
   - Add **Authorized redirect URLs**:
     - `http://localhost:3000/api/auth/callback/linkedin`
     - `https://yourdomain.com/api/auth/callback/linkedin` (for production)
4. Copy **Client ID** and **Client Secret**
5. Request access to "Sign In with LinkedIn"
6. Add them to your `.env.local`

### 3. Generate NEXTAUTH_SECRET

```bash
openssl rand -hex 32
```

Copy the output to your `.env.local` as `NEXTAUTH_SECRET`.

## File Structure

### Created Files

```
src/
├── lib/
│   └── nextAuthConfig.ts           # NextAuth configuration with OAuth providers
├── providers/
│   └── NextAuthSessionProvider.tsx # SessionProvider wrapper for NextAuth
├── app/
│   └── api/
│       └── auth/
│           ├── [...]nextauth/
│           │   └── route.ts        # NextAuth route handler
│           └── oauth-callback/
│               └── route.ts        # OAuth callback handler
└── app/
    └── auth/
        └── login/
            └── page.tsx            # Updated login page with social buttons
```

### Key Configuration File

**[src/lib/nextAuthConfig.ts](src/lib/nextAuthConfig.ts)**
- Configures Google and LinkedIn OAuth providers
- Sets up JWT callbacks for token management
- Configures session strategy and expiration

## How It Works

### OAuth Flow

1. User clicks "Google" or "LinkedIn" button on login page
2. `signIn()` from next-auth is called with the provider name
3. User is redirected to provider's login page
4. After authentication, redirected to `/api/auth/callback/[provider]`
5. NextAuth validates the token and creates a session
6. JWT callback stores user info in the token
7. Session callback provides user data to the application
8. User is redirected to home page

### Login Page

The login page (`src/app/auth/login/page.tsx`) includes:
- Email/password login form (existing)
- Google OAuth button with status indicator
- LinkedIn OAuth button with status indicator
- Error handling for failed OAuth attempts
- Loading states during authentication

## Testing Locally

### Start the development server

```bash
npm run dev
```

Visit `http://localhost:3000/auth/login`

### Test with Mock Credentials

For testing without real OAuth apps, use the credentials in `.env.local`:
- Error messages will display if credentials are incomplete
- The callback routes are set up to handle successful flows once real credentials are added

## Production Deployment

### Updates Needed for Production

1. **Update Environment Variables**
   - Add real Google and LinkedIn OAuth credentials
   - Generate a strong `NEXTAUTH_SECRET`

2. **Update Redirect URIs**
   - In Google Cloud Console: Add `https://yourdomain.com/api/auth/callback/google`
   - In LinkedIn Developer Portal: Add `https://yourdomain.com/api/auth/callback/linkedin`

3. **Update NEXTAUTH_URL**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

4. **Database Integration (Optional)**
   - Current implementation uses JWT without a database
   - For persistent user data, consider integrating Prisma with a database

## Troubleshooting

### "OAuth provider not configured"
- Ensure `.env.local` is properly set with credentials
- Restart the development server after updating `.env.local`

### Redirect URI mismatch
- Ensure redirect URI in OAuth provider matches exactly:
  - `http://localhost:3000/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/linkedin`

### Session not persisting
- Clear browser cookies and localStorage
- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Check browser console for JWT errors

### "Invalid token" errors
- Regenerate `NEXTAUTH_SECRET`: `openssl rand -hex 32`
- Update `.env.local` and restart server
- Clear browser cache and cookies

## Integration with Existing Auth

The social login integrates seamlessly with the existing `AuthProvider`:
- On successful login, the user session is managed by NextAuth
- The existing `useAuth()` hook still works for checking authentication status
- Both email/password and OAuth methods work together

## API Routes

### `/api/auth/[...nextauth]`
- Handles all NextAuth OAuth flows
- Manages session creation and validation

### `/api/auth/oauth-callback`
- Custom callback handler for OAuth responses
- Creates or updates user records

### `/api/auth/login` (existing)
- Handles email/password login
- Returns JWT token and user info

## Next Steps

1. Get OAuth credentials from Google and LinkedIn
2. Add credentials to `.env.local`
3. Test the social login buttons on the login page
4. Deploy to production with updated credentials

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://console.cloud.google.com/)
- [LinkedIn OAuth Setup](https://www.linkedin.com/developers/apps)
- [NextAuth Providers](https://next-auth.js.org/providers/)
