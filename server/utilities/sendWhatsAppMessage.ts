    import whapi from '@api/whapi';
    import  dotenv from 'dotenv';
    dotenv.config();

    const WHAPI_URL = process.env.WHAPI_URL || ''; // Base URL for WhatsApp API
    const WHAPI_TOKEN = process.env.WHAPI_TOKEN || ''; // WhatsApp API Token

    whapi.auth(WHAPI_TOKEN); // Authenticate the API

    // Send WhatsApp message function
    export const sendWhatsAppMessage = async (phone: string, message: string): Promise<void> => {
    try {
        // Use the `whapi` object directly for making API calls
        const response = await whapi.sendMessageText({
        to: `${phone}@s.whatsapp.net`, // Recipient's phone number
        body: message, // WhatsApp message content
        typing_time: 0, // Optional: typing animation duration
        });

        // console.log('WhatsApp message sent successfully:', response);
    } catch (err:any) {
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
            to: `${phone}@s.whatsapp.net`, // Recipient's phone number
            media: 'https://static.startuptalky.com/2024/10/Feature-Image-Top-Food-Delivery-Startups-Startuptalky.jpg', // Image URL or base64-encoded string
            mime_type: 'image/jpg', // MIME type (e.g., 'image/jpeg', 'image/png')
            view_once: viewOnce, // Optional: View once setting
            no_encode: true, // Avoid additional encoding
            no_cache: true, // Avoid caching the image
          });
      
          // console.log('WhatsApp image message sent successfully:', response);
        } catch (err: any) {
          console.error('Error sending WhatsApp image message:', err.message || err);
          throw new Error('Failed to send WhatsApp image message');
        }
      };

