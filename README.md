# Axon OAuth Tester

A comprehensive OAuth integration testing application with support for 15+ providers including HubSpot, Slack, Microsoft, Google, Salesforce, and more.

## Features

- **OAuth 2.0 Integration**: Complete OAuth flows for 15+ providers
- **HubSpot CRM**: Full HubSpot OAuth integration with CRM access
- **Token Management**: Secure token storage and refresh system
- **API Testing**: Built-in testing routes for all providers
- **Frontend UI**: Modern React interface with Connect buttons
- **Production Ready**: Secure configuration and error handling

## Supported Providers

### CRM & Sales
- **HubSpot** - OAuth and Access Token methods
- **Salesforce** - OAuth integration

### Collaboration
- **Slack** - OAuth 2.0 flow
- **Microsoft Teams** - Graph API integration
- **Google** - Gmail, Calendar, Drive, Docs
- **Jira** - Atlassian Cloud OAuth
- **Confluence** - Atlassian Cloud OAuth
- **Notion** - OAuth and Access Token
- **ClickUp** - OAuth integration
- **Asana** - OAuth integration
- **Calendly** - OAuth integration

### Productivity & Tools
- **Figma** - OAuth integration
- **Dropbox** - OAuth integration
- **Box** - OAuth integration
- **Zoom** - OAuth integration
- **DocuSign** - OAuth integration
- **Stripe** - API integration
- **Mailchimp** - API integration
- **Airtable** - API integration
- **Jotform** - API integration
- **Ticketbud** - API integration

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dhanya-1419/Axon-OAuth-Tester.git
   cd Axon-OAuth-Tester
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open application**
   Navigate to `http://localhost:3000`

## Environment Configuration

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
# HubSpot OAuth
HUBSPOT_CLIENT_ID=your_hubspot_client_id
HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret

# Other providers...
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# ... etc
```

## OAuth Flow

1. Select a provider from the dropdown
2. Click "Connect" for OAuth providers
3. Authorize the application in the provider's interface
4. Redirect back to application with success
5. Token is stored securely for API calls

## API Testing

Each provider includes built-in testing routes:

- **Basic connectivity tests**
- **Authentication validation**
- **API endpoint testing**
- **Token refresh testing**

## Security

- **Environment variables**: Protected by `.gitignore`
- **Token storage**: Secure in-memory storage
- **HTTPS only**: All OAuth callbacks use HTTPS
- **Scope limiting**: Minimal required scopes only
- **Secret scanning**: Repository configured for secret detection

## Development

### Project Structure
```
app/
├── api/
│   ├── oauth/
│   │   ├── start/     # OAuth initiation routes
│   │   └── callback/   # OAuth callback routes
│   ├── test/           # API testing routes
│   └── tokens/         # Token management
├── page.jsx           # Main application
└── layout.jsx         # App layout
```

### Adding New Providers

1. Create OAuth start route: `app/api/oauth/start/{provider}/route.js`
2. Create OAuth callback route: `app/api/oauth/callback/{provider}/route.js`
3. Add provider to `APP_DEFS` in `app/page.jsx`
4. Add environment variables to `.env.example`
5. Add testing route: `app/api/test/{provider}/route.js`

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
- Create an issue in the repository
- Check the documentation
- Review the setup guides

## What is supported

The UI includes presets for:

- GitHub (PAT): `GET https://api.github.com/user`
- Slack (bot/user token): `POST https://slack.com/api/auth.test`
- Stripe (secret key): `GET https://api.stripe.com/v1/account`
- Google OAuth token info (access token): `GET https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=...`
- Microsoft Graph (access token): `GET https://graph.microsoft.com/v1.0/me`
- Jira Cloud (email + api token + site url): `GET {siteUrl}/rest/api/3/myself`
- Confluence Cloud (email + api token + site url): `GET {siteUrl}/wiki/rest/api/user/current`
- Salesforce (instance url + access token): `GET {instanceUrl}/services/data/v58.0/`
- Generic HTTP: server fetches a URL with optional `Authorization` header

## Notes / security

- Do not deploy this publicly.
- Avoid pasting production secrets.
- This project does **not** implement full OAuth (redirect + consent + refresh). It expects you to paste existing tokens/keys.

## Add more apps

Tell me which apps you want next (example: Mailchimp, Notion, Zoom, QuickBooks, DocuSign) and what credential type you have for each (API key vs OAuth access token), and I’ll add dedicated test calls.
