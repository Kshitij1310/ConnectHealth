# TikTok Ads Campaign Manager

## Project Overview

This project was built as part of a frontend assignment. It's a React app that lets users log in with their TikTok account and create ad campaigns.

The main features are:
- Real TikTok OAuth login (not simulated)
- A form to create ad campaigns with validation
- Saving campaigns locally so they don't disappear on refresh
- View and delete campaigns you've created

Everything runs on the frontend only. There's no backend server involved.

**Live URL:** https://kshitij1310.github.io/ConnectHealth/

## How to Run the Project

If you want to run this locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open http://localhost:3000/ConnectHealth/

To build for production:
```
npm run build
```

To deploy to GitHub Pages:
```
npm run deploy
```

## OAuth Setup Steps

The TikTok OAuth is already configured and working. But if you want to set it up from scratch or understand how it works:

1. Go to TikTok Developer Portal and create an app
2. Set the redirect URI to match your deployment URL (mine is set to the GitHub Pages URL)
3. Copy your Client Key and Client Secret
4. Update the config file with your credentials
5. Make sure the redirect URI in TikTok matches exactly what's in the code

Since this is frontend-only, the OAuth token exchange happens on the client side. I know this isn't ideal for production, but it works for this assignment.

## Assumptions or Shortcuts Taken

Here are some things I simplified or assumed:

- **No backend:** The token exchange happens on the frontend. In a real app, this should be done on a secure backend server.

- **Client secret exposed:** Since there's no backend, the client secret is visible in the code. This is acceptable for the assignment but wouldn't be safe in production.

- **Music upload simulation:** The custom music upload feature generates a mock ID instead of actually uploading a file. TikTok's music API would require more setup.

- **Local storage only:** Campaigns are stored in the browser's localStorage. They won't sync across devices or browsers.

- **Limited error handling:** Some edge cases might not be handled perfectly. The focus was on getting the core OAuth flow and form working properly.

- **No actual ad creation:** When you submit a campaign, it's just saved locally. It doesn't actually create an ad on TikTok because that would need advertiser credentials and backend integration.

The main goal was to demonstrate a working OAuth flow with real TikTok authentication and a functional UI for managing campaigns.
