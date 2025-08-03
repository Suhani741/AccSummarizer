# ACC Summarizer

A Node.js script that fetches opportunity data from the DevRev API, summarizes key metrics, and posts the summary to a Slack channel.

## Features

- Fetches opportunities from DevRev API
- Calculates total deals, total revenue, top account, and average deal size
- Posts a formatted summary to a specified Slack channel

## Prerequisites

- Node.js (v16+ recommended)
- npm
- DevRev API key
- Slack Bot token with permission to post in your channel

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Create a `.env` file in the project root:**
   ```
   DEVREV_API_KEY=your_devrev_api_key
   SLACK_BOT_TOKEN=your_slack_bot_token
   SLACK_CHANNEL_ID=your_slack_channel_id
   ```

3. **Run the script:**
   ```sh
   npx ts-node acc-summarizer.ts
   ```
   Or, if you have compiled to JavaScript:
   ```sh
   node acc-summarizer.js
   ```

## Notes

- Make sure your Slack bot is invited to the target channel.
- Adjust the DevRev API endpoint or response parsing as needed for your data.


