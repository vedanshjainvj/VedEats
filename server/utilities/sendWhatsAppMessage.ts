import dotenv from 'dotenv';

// --------------- Importing Other Files ---------------
import whapi from '@api/whapi';

dotenv.config();

const WHAPI_URL = process.env.WHAPI_URL || '';
const WHAPI_TOKEN = process.env.WHAPI_TOKEN || '';
whapi.auth(WHAPI_TOKEN);

// Send WhatsApp message function
export const sendWhatsAppMessage = async (phone: string, message: string): Promise<void> => {
  try {
    const response = await whapi.sendMessageText({
      to: `${phone}@s.whatsapp.net`,
      body: message,
      typing_time: 0,
    });

  } catch (err: any) {
    console.error('Error sending WhatsApp message:', err.message || err);
    throw new Error('Failed to send WhatsApp message');
  }
};

export const sendWhatsAppImageMessage = async (
  phone: string,
  // imageUrl: string,
  // mimeType: string,
  // caption: string,
  viewOnce: boolean = false
): Promise<void> => {
  try {
    const response = await whapi.sendMessageImage({
      to: `${phone}@s.whatsapp.net`,
      media: 'https://static.startuptalky.com/2024/10/Feature-Image-Top-Food-Delivery-Startups-Startuptalky.jpg', // Image URL or base64-encoded string
      mime_type: 'image/jpg',
      view_once: viewOnce,
      no_encode: true,
      no_cache: true,
    });

  } catch (err: any) {
    console.error('Error sending WhatsApp image message:', err.message || err);
    throw new Error('Failed to send WhatsApp image message');
  }
};

