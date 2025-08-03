import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables from .env file
dotenv.config();

// Get API keys and Slack channel ID from environment variables
const devRevApiKey = process.env.DEVREV_API_KEY;
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackChannelId = process.env.SLACK_CHANNEL_ID;

// Check if the environment variables are correctly loaded
if (!devRevApiKey || !slackBotToken || !slackChannelId) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);  // Exit the process if keys are missing
}

// Function to fetch opportunities data from DevRev
async function fetchOpportunities() {
  try {
    const response = await axios.get('https://api.devrev.ai/v1/opportunities', {
      headers: {
        'Authorization': `Bearer ${devRevApiKey}`,
      },
    });

    // Adjust this if the API response structure is different
    return response.data.opportunities || response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error fetching opportunities data: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('Error fetching opportunities data:', error.message);
    }
    return null;
  }
}

// Function to send summary to Slack
async function postToSlack(message: string) {
  try {
    const response = await axios.post('https://slack.com/api/chat.postMessage', {
      channel: slackChannelId,
      text: message,
    }, {
      headers: {
        'Authorization': `Bearer ${slackBotToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.data.ok) {
      throw new Error(`Slack API error: ${JSON.stringify(response.data)}`);
    }
    console.log('Summary posted to Slack!');
  } catch (error: any) {
    console.error('Error posting to Slack:', error.message);
  }
}

// Function to create the opportunity summary
async function createOpportunitySummary() {
  const opportunities = await fetchOpportunities();
  if (!opportunities || opportunities.length === 0) {
    console.log('No opportunity data found.');
    return;
  }

  let totalRevenue = 0;
  let dealCount = opportunities.length;
  let topAccount: { account: string; revenue: number } = { account: '', revenue: 0 };
  let totalDealSize = 0;

  opportunities.forEach((opp: any) => {
    const revenue = opp.revenue ?? opp.financials?.revenue;
    if (typeof revenue === 'number') {
      totalRevenue += revenue;
      totalDealSize += revenue;
      if (revenue > topAccount.revenue) {
        topAccount = { account: opp.account, revenue };
      }
    } else {
      console.warn(`Opportunity with account ${opp.account} does not have revenue data.`);
    }
  });

  const averageDealSize = dealCount > 0 ? totalDealSize / dealCount : 0;

  const message = `
*Opportunity Summary:*
- *Total Deals:* ${dealCount}
- *Total Revenue:* $${totalRevenue.toFixed(2)}
- *Top Account:* ${topAccount.account}
- *Average Deal Size:* $${averageDealSize.toFixed(2)}
  `;

  await postToSlack(message);
}

// Run the summarizer
createOpportunitySummary();
