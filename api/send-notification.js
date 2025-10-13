// Vercel Serverless Function for OneSignal notifications

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API keys from environment (SECURE!)
  const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
  const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;

  try {
    const { title, message, url } = req.body;

    // Validate input
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
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
        url: url || 'https://25fcyber.vercel.app'
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ 
        success: true, 
        recipients: data.recipients,
        message: 'Notification sent successfully!' 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: data.errors || 'Failed to send notification' 
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
