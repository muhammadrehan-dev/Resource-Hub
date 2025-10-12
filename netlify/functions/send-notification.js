// Secure serverless function to send OneSignal notifications
// API keys are hidden in environment variables

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get API keys from environment (SECURE!)
  const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
  const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;

  try {
    const { title, message, url } = JSON.parse(event.body);

    // Validate input
    if (!title || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Title and message are required' })
      };
    }

    // Send notification via OneSignal API
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_API_KEY}`
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ['All'],
        headings: { en: title },
        contents: { en: message },
        url: url || 'https://25fcyber.netlify.app'
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          recipients: data.recipients,
          message: 'Notification sent successfully!' 
        })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: data.errors || 'Failed to send notification' 
        })
      };
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      })
    };
  }
};
