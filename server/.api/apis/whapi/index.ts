import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'whapi/1.8.7 (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Allows you to track and get feedback on the operational status of the whapi channel
   * (instance). An instance is a connection with a phone number that has a WhatsApp account,
   * which will be responsible for sending and receiving messages
   *
   * @summary Check health & launch channel
   * @throws FetchError<500, types.CheckHealthResponse500> Internal Error
   */
  checkHealth(metadata?: types.CheckHealthMetadataParam): Promise<FetchResponse<200, types.CheckHealthResponse200>> {
    return this.core.fetch('/health', 'get', metadata);
  }

  /**
   * Get channel settings
   *
   * @throws FetchError<500, types.GetChannelSettingsResponse500> Internal Error
   */
  getChannelSettings(body?: types.GetChannelSettingsBodyParam): Promise<FetchResponse<200, types.GetChannelSettingsResponse200>> {
    return this.core.fetch('/settings', 'get', body);
  }

  /**
   * Reset channel settings
   *
   * @throws FetchError<409, types.ResetChannelSettingsResponse409> Settings already reset
   * @throws FetchError<500, types.ResetChannelSettingsResponse500> Internal Error
   */
  resetChannelSettings(): Promise<FetchResponse<200, types.ResetChannelSettingsResponse200>> {
    return this.core.fetch('/settings', 'delete');
  }

  /**
   * If a field is not present in the request, no change is made to that setting. For
   * example, if 'proxy' is not sent with the request, the existing configuration for 'proxy'
   * is unchanged.
   *
   * @summary Update channel settings
   * @throws FetchError<400, types.UpdateChannelSettingsResponse400> Wrong settings format
   * @throws FetchError<500, types.UpdateChannelSettingsResponse500> Internal Error
   */
  updateChannelSettings(body?: types.UpdateChannelSettingsBodyParam): Promise<FetchResponse<200, types.UpdateChannelSettingsResponse200>> {
    return this.core.fetch('/settings', 'patch', body);
  }

  /**
   * Get a list of specific events that you can be notified about when Webhook is configured
   *
   * @summary Get allowed events
   * @throws FetchError<500, types.GetAllowedEventsResponse500> Internal Error
   */
  getAllowedEvents(): Promise<FetchResponse<200, types.GetAllowedEventsResponse200>> {
    return this.core.fetch('/settings/events', 'get');
  }

  /**
   * For testing webhook.
   *
   * @summary Test webhook
   * @throws FetchError<400, types.WebhookTestResponse400> Wrong parameters
   * @throws FetchError<500, types.WebhookTestResponse500> Internal Error
   */
  webhookTest(body: types.WebhookTestBodyParam): Promise<FetchResponse<200, types.WebhookTestResponse200>> {
    return this.core.fetch('/settings/webhook_test', 'post', body);
  }

  /**
   * This method returns an image of the type base64. You can render this in a component of
   * the type image that is compatible with the language that you use to program. Just like
   * on WhatsApp Web you will need to read a QR code to connect to Whapi.Cloud. There are two
   * ways that you can do the reading of the QR code. Connect through our dashboard panel or
   * Make this experience available within your own application.
   *
   * @summary Login user with QR-base64
   * @throws FetchError<406, types.LoginUserResponse406> Not acceptable for mobile type channel
   * @throws FetchError<409, types.LoginUserResponse409> Channel already authenticated
   * @throws FetchError<422, types.LoginUserResponse422> Render QR failed
   * @throws FetchError<500, types.LoginUserResponse500> Internal Error
   */
  loginUser(metadata?: types.LoginUserMetadataParam): Promise<FetchResponse<200, types.LoginUserResponse200>> {
    return this.core.fetch('/users/login', 'get', metadata);
  }

  /**
   * This method returns an image. Just like on WhatsApp Web you will need to read a QR code
   * to connect to Whapi.Cloud. There are two ways that you can do the reading of the QR
   * code. Connect through our dashboard panel or Make this experience available within your
   * own application.
   *
   * @summary Login user with QR-image
   * @throws FetchError<500, types.LoginUserImageResponse500> Internal Error
   */
  loginUserImage(metadata?: types.LoginUserImageMetadataParam): Promise<FetchResponse<200, types.LoginUserImageResponse200>> {
    return this.core.fetch('/users/login/image', 'get', metadata);
  }

  /**
   * Login user with QR-rowdata
   *
   * @throws FetchError<406, types.LoginUserRowDataResponse406> Not acceptable for mobile type channel
   * @throws FetchError<409, types.LoginUserRowDataResponse409> Channel already authenticated
   * @throws FetchError<500, types.LoginUserRowDataResponse500> Internal Error
   */
  loginUserRowData(metadata?: types.LoginUserRowDataMetadataParam): Promise<FetchResponse<200, types.LoginUserRowDataResponse200>> {
    return this.core.fetch('/users/login/rowdata', 'get', metadata);
  }

  /**
   * This method returns a code that allows you to connect the phone number to the API
   * without the need to scan a QR code, simply by entering the generated code.
   *
   * @summary Get auth code by phone number
   * @throws FetchError<400, types.LoginUserViaAuthCodeResponse400> Invalid phone number
   * @throws FetchError<406, types.LoginUserViaAuthCodeResponse406> Not acceptable for mobile type channel
   * @throws FetchError<409, types.LoginUserViaAuthCodeResponse409> Channel already authenticated
   * @throws FetchError<422, types.LoginUserViaAuthCodeResponse422> Render QR failed
   * @throws FetchError<500, types.LoginUserViaAuthCodeResponse500> Internal Error
   */
  loginUserViaAuthCode(metadata: types.LoginUserViaAuthCodeMetadataParam): Promise<FetchResponse<200, types.LoginUserViaAuthCodeResponse200>> {
    return this.core.fetch('/users/login/{PhoneNumber}', 'get', metadata);
  }

  /**
   * Allows you to register a number on WhatsApp. Requires mandatory use of mobile proxies!
   *
   * @summary Login in whatsapp with phone number
   * @throws FetchError<400, types.LoginUserViaMobileResponse400> Invalid phone number
   * @throws FetchError<403, types.LoginUserViaMobileResponse403> Forbidden without a proxy
   * @throws FetchError<406, types.LoginUserViaMobileResponse406> Acceptable only for mobile type channel
   * @throws FetchError<409, types.LoginUserViaMobileResponse409> Channel already authenticated
   * @throws FetchError<412, types.LoginUserViaMobileResponse412> A different phone number has been provided. To authorize with a new number, please
   * logout and initiate mobile login process again
   * @throws FetchError<422, types.LoginUserViaMobileResponse422> Render QR failed
   * @throws FetchError<500, types.LoginUserViaMobileResponse500> Internal Error
   */
  loginUserViaMobile(body: types.LoginUserViaMobileBodyParam): Promise<FetchResponse<200, types.LoginUserViaMobileResponse200>> {
    return this.core.fetch('/users/login/mobile', 'post', body);
  }

  /**
   * Logout user
   *
   * @throws FetchError<409, types.LogoutUserResponse409> Channel already logged out
   * @throws FetchError<500, types.LogoutUserResponse500> Internal Error
   */
  logoutUser(): Promise<FetchResponse<200, types.LogoutUserResponse200>> {
    return this.core.fetch('/users/logout', 'post');
  }

  /**
   * The method allows you to get information about your WhatsApp profile
   *
   * @summary User info
   * @throws FetchError<500, types.GetUserProfileResponse500> Internal Error
   */
  getUserProfile(): Promise<FetchResponse<200, types.GetUserProfileResponse200>> {
    return this.core.fetch('/users/profile', 'get');
  }

  /**
   * This method is responsible for changing the details of your WhatsApp profile
   *
   * @summary Update user info
   * @throws FetchError<500, types.UpdateUserProfileResponse500> Internal Error
   */
  updateUserProfile(body: types.UpdateUserProfileBodyParam): Promise<FetchResponse<200, types.UpdateUserProfileResponse200>> {
    return this.core.fetch('/users/profile', 'patch', body);
  }

  /**
   * The method contains a list of all received and sent messages in a particular chat.
   * Sorting by descending date of message sending.
   *
   * @summary Get messages
   * @throws FetchError<400, types.GetMessagesResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetMessagesResponse500> Internal Error
   */
  getMessages(metadata?: types.GetMessagesMetadataParam): Promise<FetchResponse<200, types.GetMessagesResponse200>> {
    return this.core.fetch('/messages/list', 'get', metadata);
  }

  /**
   * The method contains a list of all received and sent messages in a particular chat.
   * Sorting by descending date of message sending. You will need to specify [Chat
   * ID](https://support.whapi.cloud/help-desk/faq/chat-id.-what-is-it-and-how-to-get-it)
   *
   * @summary Get messages by chat ID
   * @throws FetchError<400, types.GetMessagesByChatIdResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetMessagesByChatIdResponse404> Specified chat not found
   * @throws FetchError<500, types.GetMessagesByChatIdResponse500> Internal Error
   */
  getMessagesByChatID(metadata: types.GetMessagesByChatIdMetadataParam): Promise<FetchResponse<200, types.GetMessagesByChatIdResponse200>> {
    return this.core.fetch('/messages/list/{ChatID}', 'get', metadata);
  }

  /**
   * This endpoint will let you send messages to any WhatsApp-enabled phone number or to any
   * WhatsApp Group/Channel using your own number connected to Whapi.Cloud. Follow the
   * instructions if you want to [format
   * text](https://support.whapi.cloud/help-desk/faq/whatsapp-text-formatting), [send a
   * emoji](https://support.whapi.cloud/help-desk/sending/send-emoji) or [use line
   * breaks](https://support.whapi.cloud/help-desk/faq/how-to-send-a-paragraph-line-break).
   *
   * @summary 💬 Send text message
   * @throws FetchError<400, types.SendMessageTextResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageTextResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageTextResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageTextResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<413, types.SendMessageTextResponse413> Request body too large
   * @throws FetchError<429, types.SendMessageTextResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageTextResponse500> Internal Error
   */
  sendMessageText(body: types.SendMessageTextBodyParam): Promise<FetchResponse<200, types.SendMessageTextResponse200>> {
    return this.core.fetch('/messages/text', 'post', body);
  }

  /**
   * This method is responsible for sending images for chats. The requirements for [sending
   * all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 🖼 Send media-image message
   * @throws FetchError<400, types.SendMessageImageResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageImageResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageImageResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageImageResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageImageResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageImageResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageImageResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageImageResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageImageResponse500> Internal Error
   */
  sendMessageImage(body: types.SendMessageImageBodyParam): Promise<FetchResponse<200, types.SendMessageImageResponse200>> {
    return this.core.fetch('/messages/image', 'post', body);
  }

  /**
   * This method is responsible for sending a video message for chats. The requirements for
   * [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 🎥 Send media-video message
   * @throws FetchError<400, types.SendMessageVideoResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageVideoResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageVideoResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageVideoResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageVideoResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageVideoResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageVideoResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageVideoResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageVideoResponse500> Internal Error
   */
  sendMessageVideo(body: types.SendMessageVideoBodyParam): Promise<FetchResponse<200, types.SendMessageVideoResponse200>> {
    return this.core.fetch('/messages/video', 'post', body);
  }

  /**
   * This method is responsible for sending a short video in the circle for chats. The
   * requirements for [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 📹 Send media-short video message (PTV)
   * @throws FetchError<400, types.SendMessageShortResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageShortResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageShortResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageShortResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageShortResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageShortResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageShortResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageShortResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageShortResponse500> Internal Error
   */
  sendMessageShort(body: types.SendMessageShortBodyParam): Promise<FetchResponse<200, types.SendMessageShortResponse200>> {
    return this.core.fetch('/messages/short', 'post', body);
  }

  /**
   * Method responsible for sending GIFs to your chats through the API (The file to be sent
   * must be an MP4)
   *
   * @summary 🎬 Send media-gif message
   * @throws FetchError<400, types.SendMessageGifResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageGifResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageGifResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageGifResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageGifResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageGifResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageGifResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageGifResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageGifResponse500> Internal Error
   */
  sendMessageGif(body: types.SendMessageGifBodyParam): Promise<FetchResponse<200, types.SendMessageGifResponse200>> {
    return this.core.fetch('/messages/gif', 'post', body);
  }

  /**
   * This method is responsible for sending audio messages for chats. The requirements for
   * [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 🎵 Send media-audio message
   * @throws FetchError<400, types.SendMessageAudioResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageAudioResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageAudioResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageAudioResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageAudioResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageAudioResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageAudioResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageAudioResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageAudioResponse500> Internal Error
   */
  sendMessageAudio(body: types.SendMessageAudioBodyParam): Promise<FetchResponse<200, types.SendMessageAudioResponse200>> {
    return this.core.fetch('/messages/audio', 'post', body);
  }

  /**
   * This method is responsible for sending a voice message for chats. The requirements for
   * [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document).
   * However, there are [some
   * nuances](https://support.whapi.cloud/help-desk/sending/overview-of-other-methods-for-sending/send-voice-message)
   * when sending voice messages
   *
   * @summary 🎤 Send media-voice message
   * @throws FetchError<400, types.SendMessageVoiceResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageVoiceResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageVoiceResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageVoiceResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageVoiceResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageVoiceResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageVoiceResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageVoiceResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageVoiceResponse500> Internal Error
   */
  sendMessageVoice(body: types.SendMessageVoiceBodyParam): Promise<FetchResponse<200, types.SendMessageVoiceResponse200>> {
    return this.core.fetch('/messages/voice', 'post', body);
  }

  /**
   * This method is responsible for sending documents for chats. The requirements for
   * [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 📑 Send media-document message
   * @throws FetchError<400, types.SendMessageDocumentResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageDocumentResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageDocumentResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageDocumentResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageDocumentResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageDocumentResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageDocumentResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageDocumentResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageDocumentResponse500> Internal Error
   */
  sendMessageDocument(body: types.SendMessageDocumentBodyParam): Promise<FetchResponse<200, types.SendMessageDocumentResponse200>> {
    return this.core.fetch('/messages/document', 'post', body);
  }

  /**
   * Method responsible for sending links with customize preview to your contacts, it is used
   * to share links so that the user can be redirected to a website. Your link must
   * necessarily be in the Body parameter. It is important for you to know that [the link is
   * only
   * clickable](https://support.whapi.cloud/help-desk/faq/inactive-links-in-whatsapp-messages)
   * if the recipient already has your phone number in their contacts, or if they start a
   * conversation with you
   *
   * @summary 📎 Send link preview message
   * @throws FetchError<400, types.SendMessageLinkPreviewResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageLinkPreviewResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageLinkPreviewResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageLinkPreviewResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageLinkPreviewResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageLinkPreviewResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageLinkPreviewResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageLinkPreviewResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageLinkPreviewResponse500> Internal Error
   */
  sendMessageLinkPreview(body: types.SendMessageLinkPreviewBodyParam): Promise<FetchResponse<200, types.SendMessageLinkPreviewResponse200>> {
    return this.core.fetch('/messages/link_preview', 'post', body);
  }

  /**
   * Method responsible for sending a fixed location to your contacts, it is mostly used to
   * send an address’s location
   *
   * @summary 📍 Send location message
   * @throws FetchError<400, types.SendMessageLocationResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageLocationResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageLocationResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageLocationResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<413, types.SendMessageLocationResponse413> Request body too large
   * @throws FetchError<429, types.SendMessageLocationResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageLocationResponse500> Internal Error
   */
  sendMessageLocation(body: types.SendMessageLocationBodyParam): Promise<FetchResponse<200, types.SendMessageLocationResponse200>> {
    return this.core.fetch('/messages/location', 'post', body);
  }

  /**
   * 🧭 Send live location message
   *
   * @throws FetchError<400, types.SendMessageLiveLocationResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageLiveLocationResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageLiveLocationResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageLiveLocationResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<413, types.SendMessageLiveLocationResponse413> Request body too large
   * @throws FetchError<429, types.SendMessageLiveLocationResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageLiveLocationResponse500> Internal Error
   */
  sendMessageLiveLocation(body: types.SendMessageLiveLocationBodyParam): Promise<FetchResponse<200, types.SendMessageLiveLocationResponse200>> {
    return this.core.fetch('/messages/live_location', 'post', body);
  }

  /**
   * Simple and object, this method allows you to send a contact. You don't need to have it
   * added to your contacts list, all you have to do is fill in the method attributes with
   * the contact information and send. [A few ready
   * examples](https://support.whapi.cloud/help-desk/sending/overview-of-other-methods-for-sending/send-contact-vcard)
   *
   * @summary 👤 Send contact message
   * @throws FetchError<400, types.SendMessageContactResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageContactResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageContactResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageContactResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<413, types.SendMessageContactResponse413> Request body too large
   * @throws FetchError<429, types.SendMessageContactResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageContactResponse500> Internal Error
   */
  sendMessageContact(body: types.SendMessageContactBodyParam): Promise<FetchResponse<200, types.SendMessageContactResponse200>> {
    return this.core.fetch('/messages/contact', 'post', body);
  }

  /**
   * Simple and straightforward, this method allows you to send multiple contacts. You don't
   * need to have them in your contacts; just fill the method's attributes with the contact
   * information and send. [A few ready
   * examples](https://support.whapi.cloud/help-desk/sending/overview-of-other-methods-for-sending/send-contact-vcard)
   *
   * @summary 👥 Send contact list message
   * @throws FetchError<400, types.SendMessageContactListResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageContactListResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageContactListResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageContactListResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<413, types.SendMessageContactListResponse413> Request body too large
   * @throws FetchError<429, types.SendMessageContactListResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageContactListResponse500> Internal Error
   */
  sendMessageContactList(body: types.SendMessageContactListBodyParam): Promise<FetchResponse<200, types.SendMessageContactListResponse200>> {
    return this.core.fetch('/messages/contact_list', 'post', body);
  }

  /**
   * In this method, you can send poll-type messages. Often, it's the polls that replace [the
   * buttons for interactive
   * communication](https://support.whapi.cloud/help-desk/hints/how-to-use-polls-as-buttons)
   *
   * @summary 📊 Send poll message
   * @throws FetchError<400, types.SendMessagePollResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessagePollResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessagePollResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessagePollResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<429, types.SendMessagePollResponse429> Too many requests
   * @throws FetchError<500, types.SendMessagePollResponse500> Internal Error
   */
  sendMessagePoll(body: types.SendMessagePollBodyParam): Promise<FetchResponse<200, types.SendMessagePollResponse200>> {
    return this.core.fetch('/messages/poll', 'post', body);
  }

  /**
   * This endpoint is responsible for sending messages with buttons. The section is
   * constantly updated as the functionality of buttons depends on WhatsApp updates.
   * Attention! The functionality of sending messages with buttons is not stable! For more
   * information, please visit the [Button Status
   * topic](https://support.whapi.cloud/help-desk/faq/current-status-of-buttons-on-whatsapp).
   *
   * @summary 🎮 Send interactive message
   * @throws FetchError<400, types.SendMessageInteractiveResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageInteractiveResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageInteractiveResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageInteractiveResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageInteractiveResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageInteractiveResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageInteractiveResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageInteractiveResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageInteractiveResponse500> Internal Error
   */
  sendMessageInteractive(body: types.SendMessageInteractiveBodyParam): Promise<FetchResponse<200, types.SendMessageInteractiveResponse200>> {
    return this.core.fetch('/messages/interactive', 'post', body);
  }

  /**
   * This method is responsible for sending a sticker message for chats. The requirements for
   * [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 🎭 Send media-sticker message
   * @throws FetchError<400, types.SendMessageStickerResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageStickerResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMessageStickerResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageStickerResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageStickerResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageStickerResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageStickerResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageStickerResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageStickerResponse500> Internal Error
   */
  sendMessageSticker(body: types.SendMessageStickerBodyParam): Promise<FetchResponse<200, types.SendMessageStickerResponse200>> {
    return this.core.fetch('/messages/sticker', 'post', body);
  }

  /**
   * The method responsible for sending images or texts to your status. Remember that
   * statuses disappear after 24 hours. The requirements for [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 👁️‍🗨️ Send story message
   * @throws FetchError<400, types.SendMessageStoryResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageStoryResponse401> Need channel authorization for posting stories
   * @throws FetchError<402, types.SendMessageStoryResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageStoryResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageStoryResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageStoryResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageStoryResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageStoryResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageStoryResponse500> Internal Error
   */
  sendMessageStory(body: types.SendMessageStoryBodyParam): Promise<FetchResponse<200, types.SendMessageStoryResponse200>> {
    return this.core.fetch('/messages/story', 'post', body);
  }

  /**
   * The method responsible for sending audio to your status. Remember that statuses
   * disappear after 24 hours. The requirements for [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 🎵️ Send story audio message
   * @throws FetchError<400, types.SendMessageStoryAudioResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageStoryAudioResponse401> Need channel authorization for posting stories
   * @throws FetchError<402, types.SendMessageStoryAudioResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageStoryAudioResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageStoryAudioResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageStoryAudioResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageStoryAudioResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageStoryAudioResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageStoryAudioResponse500> Internal Error
   */
  sendMessageStoryAudio(body: types.SendMessageStoryAudioBodyParam): Promise<FetchResponse<200, types.SendMessageStoryAudioResponse200>> {
    return this.core.fetch('/messages/story/audio', 'post', body);
  }

  /**
   * The method responsible for sending images or video to your status. Remember that
   * statuses disappear after 24 hours. The requirements for [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 🖼 Send story media message
   * @throws FetchError<400, types.SendMessageStoryMediaResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageStoryMediaResponse401> Need channel authorization for posting stories
   * @throws FetchError<402, types.SendMessageStoryMediaResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageStoryMediaResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageStoryMediaResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageStoryMediaResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageStoryMediaResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageStoryMediaResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageStoryMediaResponse500> Internal Error
   */
  sendMessageStoryMedia(body: types.SendMessageStoryMediaBodyParam): Promise<FetchResponse<200, types.SendMessageStoryMediaResponse200>> {
    return this.core.fetch('/messages/story/media', 'post', body);
  }

  /**
   * The method responsible for sending texts to your status. Remember that statuses
   * disappear after 24 hours.
   *
   * @summary 💬 Send story text message
   * @throws FetchError<400, types.SendMessageStoryTextResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMessageStoryTextResponse401> Need channel authorization for posting stories
   * @throws FetchError<402, types.SendMessageStoryTextResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.SendMessageStoryTextResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.SendMessageStoryTextResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMessageStoryTextResponse413> Request media too large
   * @throws FetchError<415, types.SendMessageStoryTextResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMessageStoryTextResponse429> Too many requests
   * @throws FetchError<500, types.SendMessageStoryTextResponse500> Internal Error
   */
  sendMessageStoryText(body: types.SendMessageStoryTextBodyParam): Promise<FetchResponse<200, types.SendMessageStoryTextResponse200>> {
    return this.core.fetch('/messages/story/text', 'post', body);
  }

  /**
   * Additional endpoint for easy send media-file as message.
   * Use request body as file and inpath parameters for send parameters.
   * Media message can be one of the following types:
   * - 📷 image
   * - 🎥 video
   * - 🎬 gif
   * - 🎵 audio
   * - 🎤 voice
   * - 📄 document
   * - 🎭 sticker
   *
   *
   * @summary 📎 Send media message
   * @throws FetchError<400, types.SendMediaMessageResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMediaMessageResponse401> Need channel authorization for send message
   * @throws FetchError<402, types.SendMediaMessageResponse402> Trial version limit exceeded
   * @throws FetchError<404, types.SendMediaMessageResponse404> Media with specified id not found
   * @throws FetchError<413, types.SendMediaMessageResponse413> Request media too large
   * @throws FetchError<415, types.SendMediaMessageResponse415> Unsupported media type
   * @throws FetchError<429, types.SendMediaMessageResponse429> Too many requests
   * @throws FetchError<500, types.SendMediaMessageResponse500> Internal Error
   */
  sendMediaMessage(body: types.SendMediaMessageBodyParam, metadata: types.SendMediaMessageMetadataParam): Promise<FetchResponse<200, types.SendMediaMessageResponse200>> {
    return this.core.fetch('/messages/media/{MediaMessageType}', 'post', body, metadata);
  }

  /**
   * The method returns a message from any chat by message id.
   *
   * @summary Get message
   * @throws FetchError<400, types.GetMessageResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetMessageResponse404> Specified message not found
   * @throws FetchError<500, types.GetMessageResponse500> Internal Error
   */
  getMessage(metadata: types.GetMessageMetadataParam): Promise<FetchResponse<200, types.GetMessageResponse200>> {
    return this.core.fetch('/messages/{MessageID}', 'get', metadata);
  }

  /**
   * Simple and straightforward, in this method, you can forward messages through the API by
   * providing the messageId of the message you want to forward and the phone number of the
   * chat where this messageId is located.
   *
   * @summary ↪ Forward message
   * @throws FetchError<400, types.ForwardMessageResponse400> Wrong request parameters
   * @throws FetchError<401, types.ForwardMessageResponse401> Need channel authorization for forward message
   * @throws FetchError<402, types.ForwardMessageResponse402> Trial version limit exceeded
   * @throws FetchError<404, types.ForwardMessageResponse404> Specified message not found
   * @throws FetchError<429, types.ForwardMessageResponse429> Too many requests
   * @throws FetchError<500, types.ForwardMessageResponse500> Internal Error
   */
  forwardMessage(body: types.ForwardMessageBodyParam, metadata: types.ForwardMessageMetadataParam): Promise<FetchResponse<200, types.ForwardMessageResponse200>> {
    return this.core.fetch('/messages/{MessageID}', 'post', body, metadata);
  }

  /**
   * ✔✔ Mark message as read
   *
   * @throws FetchError<400, types.MarkMessageAsReadResponse400> Wrong request parameters
   * @throws FetchError<401, types.MarkMessageAsReadResponse401> Need channel authorization for mark as read message
   * @throws FetchError<404, types.MarkMessageAsReadResponse404> Specified message not found
   * @throws FetchError<500, types.MarkMessageAsReadResponse500> Internal Error
   */
  markMessageAsRead(metadata: types.MarkMessageAsReadMetadataParam): Promise<FetchResponse<200, types.MarkMessageAsReadResponse200>> {
    return this.core.fetch('/messages/{MessageID}', 'put', metadata);
  }

  /**
   * Method used to delete a text sent in a chat. You will be able to delete a message that
   * you sent as well as a message that was sent by a contact. To use this resource you will
   * only need the messageId of the message that you want to delete.
   *
   * @summary ❌ Delete message
   * @throws FetchError<400, types.DeleteMessageResponse400> Wrong request parameters
   * @throws FetchError<401, types.DeleteMessageResponse401> Need channel authorization for delete message
   * @throws FetchError<404, types.DeleteMessageResponse404> Specified message not found
   * @throws FetchError<500, types.DeleteMessageResponse500> Internal Error
   */
  deleteMessage(metadata: types.DeleteMessageMetadataParam): Promise<FetchResponse<200, types.DeleteMessageResponse200>> {
    return this.core.fetch('/messages/{MessageID}', 'delete', metadata);
  }

  /**
   * In this method you will be able to react to messages that were sent or recieved by you.
   * You will need to specify the ID of the message you will respond to, as well as [the
   * emoji](https://support.whapi.cloud/help-desk/sending/send-emoji)
   *
   * @summary 😍 React to message
   * @throws FetchError<400, types.ReactToMessageResponse400> Wrong request parameters
   * @throws FetchError<401, types.ReactToMessageResponse401> Need channel authorization for react to message
   * @throws FetchError<402, types.ReactToMessageResponse402> Trial version limit exceeded
   * @throws FetchError<404, types.ReactToMessageResponse404> Specified message not found
   * @throws FetchError<500, types.ReactToMessageResponse500> Internal Error
   */
  reactToMessage(body: types.ReactToMessageBodyParam, metadata: types.ReactToMessageMetadataParam): Promise<FetchResponse<200, types.ReactToMessageResponse200>> {
    return this.core.fetch('/messages/{MessageID}/reaction', 'put', body, metadata);
  }

  /**
   * ⭐ Star message
   *
   * @throws FetchError<400, types.StarMessageResponse400> Wrong request parameters
   * @throws FetchError<401, types.StarMessageResponse401> Need channel authorization for star message
   * @throws FetchError<404, types.StarMessageResponse404> Specified message not found
   * @throws FetchError<500, types.StarMessageResponse500> Internal Error
   */
  starMessage(body: types.StarMessageBodyParam, metadata: types.StarMessageMetadataParam): Promise<FetchResponse<200, types.StarMessageResponse200>> {
    return this.core.fetch('/messages/{MessageID}/star', 'put', body, metadata);
  }

  /**
   * 📌 Pin message
   *
   * @throws FetchError<400, types.PinMessageResponse400> Wrong request parameters
   * @throws FetchError<401, types.PinMessageResponse401> Need channel authorization for star message
   * @throws FetchError<404, types.PinMessageResponse404> Specified message not found
   * @throws FetchError<500, types.PinMessageResponse500> Internal Error
   */
  pinMessage(body: types.PinMessageBodyParam, metadata: types.PinMessageMetadataParam): Promise<FetchResponse<200, types.PinMessageResponse200>> {
    return this.core.fetch('/messages/{MessageID}/pin', 'post', body, metadata);
  }

  /**
   * Unpin message
   *
   * @throws FetchError<400, types.UnpinMessageResponse400> Wrong request parameters
   * @throws FetchError<401, types.UnpinMessageResponse401> Need channel authorization for star message
   * @throws FetchError<404, types.UnpinMessageResponse404> Specified message not found
   * @throws FetchError<500, types.UnpinMessageResponse500> Internal Error
   */
  unpinMessage(metadata: types.UnpinMessageMetadataParam): Promise<FetchResponse<200, types.UnpinMessageResponse200>> {
    return this.core.fetch('/messages/{MessageID}/pin', 'delete', metadata);
  }

  /**
   * This method is responsible for returning all of your chats. If you need to get a profile
   * pic of your contacts or chats, [refer to these
   * instructions](https://support.whapi.cloud/help-desk/receiving/http-api/get-a-profile-picture-of-a-chat-or-user).
   *
   * @summary Get chats
   * @throws FetchError<400, types.GetChatsResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetChatsResponse500> Internal Error
   */
  getChats(metadata?: types.GetChatsMetadataParam): Promise<FetchResponse<200, types.GetChatsResponse200>> {
    return this.core.fetch('/chats', 'get', metadata);
  }

  /**
   * This method is responsible for returning the metadata of a chat. Read more about [Chat
   * ID](https://support.whapi.cloud/help-desk/faq/chat-id.-what-is-it-and-how-to-get-it)
   *
   * @summary Get chat
   * @throws FetchError<400, types.GetChatResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetChatResponse404> Specified chat not found
   * @throws FetchError<500, types.GetChatResponse500> Internal Error
   */
  getChat(metadata: types.GetChatMetadataParam): Promise<FetchResponse<200, types.GetChatResponse200>> {
    return this.core.fetch('/chats/{ChatID}', 'get', metadata);
  }

  /**
   * This method is responsible for deleting chats
   *
   * @summary ❌ Delete chat
   * @throws FetchError<400, types.DeleteChatResponse400> Wrong request parameters
   * @throws FetchError<401, types.DeleteChatResponse401> Need channel authorization for delete chat
   * @throws FetchError<404, types.DeleteChatResponse404> Specified chat not found
   * @throws FetchError<500, types.DeleteChatResponse500> Internal Error
   */
  deleteChat(metadata: types.DeleteChatMetadataParam): Promise<FetchResponse<200, types.DeleteChatResponse200>> {
    return this.core.fetch('/chats/{ChatID}', 'delete', metadata);
  }

  /**
   * This method is responsible for archiving or unarchiving chats
   *
   * @summary 🗄 Archive/Unarchive chat
   * @throws FetchError<400, types.ArchiveChatResponse400> Wrong request parameters
   * @throws FetchError<401, types.ArchiveChatResponse401> Need channel authorization for archive/unarchive chat
   * @throws FetchError<404, types.ArchiveChatResponse404> Specified chat not found
   * @throws FetchError<500, types.ArchiveChatResponse500> Internal Error
   */
  archiveChat(body: types.ArchiveChatBodyParam, metadata: types.ArchiveChatMetadataParam): Promise<FetchResponse<200, types.ArchiveChatResponse200>>;
  archiveChat(metadata: types.ArchiveChatMetadataParam): Promise<FetchResponse<200, types.ArchiveChatResponse200>>;
  archiveChat(body?: types.ArchiveChatBodyParam | types.ArchiveChatMetadataParam, metadata?: types.ArchiveChatMetadataParam): Promise<FetchResponse<200, types.ArchiveChatResponse200>> {
    return this.core.fetch('/chats/{ChatID}', 'post', body, metadata);
  }

  /**
   * This method is responsible for pinning and unpinning, for muting and unmuting your
   * chats. Also this method is responsible for performing the action of reading an entire
   * chat or marking a chat as unread
   *
   * @summary ⚙️Chat Settings Management: Pin, Mute, Read, Disappearing.
   * @throws FetchError<400, types.PatchChatResponse400> Wrong request parameters
   * @throws FetchError<401, types.PatchChatResponse401> Need channel authorization for patch chat
   * @throws FetchError<404, types.PatchChatResponse404> Specified chat not found
   * @throws FetchError<500, types.PatchChatResponse500> Internal Error
   */
  patchChat(body: types.PatchChatBodyParam, metadata: types.PatchChatMetadataParam): Promise<FetchResponse<200, types.PatchChatResponse200>>;
  patchChat(metadata: types.PatchChatMetadataParam): Promise<FetchResponse<200, types.PatchChatResponse200>>;
  patchChat(body?: types.PatchChatBodyParam | types.PatchChatMetadataParam, metadata?: types.PatchChatMetadataParam): Promise<FetchResponse<200, types.PatchChatResponse200>> {
    return this.core.fetch('/chats/{ChatID}', 'patch', body, metadata);
  }

  /**
   * This method is responsible for returning all of your Whatsapp contacts
   *
   * @summary Get contacts
   * @throws FetchError<400, types.GetContactsResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetContactsResponse404> Specified contact not found
   * @throws FetchError<500, types.GetContactsResponse500> Internal Error
   */
  getContacts(metadata?: types.GetContactsMetadataParam): Promise<FetchResponse<200, types.GetContactsResponse200>> {
    return this.core.fetch('/contacts', 'get', metadata);
  }

  /**
   * This method returns whether or not the number has Whatsapp. Batch check provisioning is
   * supported, and there is no batch check limit. However, an atypical mass check can draw
   * attention to your number, so we advise [balancing the check between
   * channels](https://support.whapi.cloud/help-desk/faq/checking-if-the-number-has-whatsapp)
   *
   * @summary Check phones
   * @throws FetchError<400, types.CheckPhonesResponse400> Wrong request parameters
   * @throws FetchError<401, types.CheckPhonesResponse401> Need channel authorization for check phones
   * @throws FetchError<402, types.CheckPhonesResponse402> Trial version limit exceeded
   * @throws FetchError<429, types.CheckPhonesResponse429> Too many requests
   * @throws FetchError<500, types.CheckPhonesResponse500> Internal Error
   */
  checkPhones(body: types.CheckPhonesBodyParam): Promise<FetchResponse<200, types.CheckPhonesResponse200>> {
    return this.core.fetch('/contacts', 'post', body);
  }

  /**
   * This method is responsible for returning all of you contact’s metadata
   *
   * @summary Get contact
   * @throws FetchError<400, types.GetContactResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetContactResponse404> Specified contact not found
   * @throws FetchError<500, types.GetContactResponse500> Internal Error
   */
  getContact(metadata: types.GetContactMetadataParam): Promise<FetchResponse<200, types.GetContactResponse200>> {
    return this.core.fetch('/contacts/{ContactID}', 'get', metadata);
  }

  /**
   * Send contact
   *
   * @throws FetchError<400, types.SendContactResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendContactResponse401> Need channel authorization for add contact
   * @throws FetchError<404, types.SendContactResponse404> Specified contact not found
   * @throws FetchError<429, types.SendContactResponse429> Too many requests
   * @throws FetchError<500, types.SendContactResponse500> Internal Error
   */
  sendContact(body: types.SendContactBodyParam, metadata: types.SendContactMetadataParam): Promise<FetchResponse<200, types.SendContactResponse200>> {
    return this.core.fetch('/contacts/{ContactID}', 'post', body, metadata);
  }

  /**
   * The method individually checks for a number in WhatsApp without additional information
   *
   * @summary Check exist
   * @throws FetchError<400, types.CheckExistResponse400> Wrong request parameters
   * @throws FetchError<402, types.CheckExistResponse402> Trial version limit exceeded
   * @throws FetchError<404, types.CheckExistResponse404> Specified contact not registered
   * @throws FetchError<500, types.CheckExistResponse500> Internal Error
   */
  checkExist(metadata: types.CheckExistMetadataParam): Promise<FetchResponse<200, types.CheckExistResponse200>> {
    return this.core.fetch('/contacts/{ContactID}', 'head', metadata);
  }

  /**
   * This method allows you to get profile information (description, profile image) by phone
   * number, even if it is not in your contact list
   *
   * @summary Get profile
   * @throws FetchError<400, types.GetContactProfileResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetContactProfileResponse401> Need channel authorization for getting user info
   * @throws FetchError<402, types.GetContactProfileResponse402> Trial version limit exceeded
   * @throws FetchError<404, types.GetContactProfileResponse404> Specified user not found
   * @throws FetchError<500, types.GetContactProfileResponse500> Internal Error
   */
  getContactProfile(metadata: types.GetContactProfileMetadataParam): Promise<FetchResponse<200, types.GetContactProfileResponse200>> {
    return this.core.fetch('/contacts/{ContactID}/profile', 'get', metadata);
  }

  /**
   * Send online or offline presence
   *
   * @throws FetchError<400, types.SendMePresenceResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendMePresenceResponse401> Need channel authorization to send online or offline presence
   * @throws FetchError<404, types.SendMePresenceResponse404> Specified contact not found
   * @throws FetchError<500, types.SendMePresenceResponse500> Internal Error
   */
  sendMePresence(body: types.SendMePresenceBodyParam): Promise<FetchResponse<200, types.SendMePresenceResponse200>> {
    return this.core.fetch('/presences/me', 'put', body);
  }

  /**
   * Get presence
   *
   * @throws FetchError<400, types.GetPresenceResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetPresenceResponse401> Need channel authorization to get presence
   * @throws FetchError<404, types.GetPresenceResponse404> Specified contact presence not subscribed
   * @throws FetchError<500, types.GetPresenceResponse500> Internal Error
   */
  getPresence(metadata: types.GetPresenceMetadataParam): Promise<FetchResponse<200, types.GetPresenceResponse200>> {
    return this.core.fetch('/presences/{EntryID}', 'get', metadata);
  }

  /**
   * Subscribe to presence
   *
   * @throws FetchError<400, types.SubscribePresenceResponse400> Wrong request parameters
   * @throws FetchError<401, types.SubscribePresenceResponse401> Need channel authorization to subscribe to presence
   * @throws FetchError<402, types.SubscribePresenceResponse402> Trial version limit exceeded
   * @throws FetchError<404, types.SubscribePresenceResponse404> Specified contact not found in whatsapp
   * @throws FetchError<409, types.SubscribePresenceResponse409> Specified contact presence already subscribed
   * @throws FetchError<500, types.SubscribePresenceResponse500> Internal Error
   */
  subscribePresence(metadata: types.SubscribePresenceMetadataParam): Promise<FetchResponse<200, types.SubscribePresenceResponse200>> {
    return this.core.fetch('/presences/{EntryID}', 'post', metadata);
  }

  /**
   * Send typing or recording presence
   *
   * @throws FetchError<400, types.SendPresenceResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendPresenceResponse401> Need channel authorization to send typing or recording presence
   * @throws FetchError<404, types.SendPresenceResponse404> Specified contact not found
   * @throws FetchError<500, types.SendPresenceResponse500> Internal Error
   */
  sendPresence(body: types.SendPresenceBodyParam, metadata: types.SendPresenceMetadataParam): Promise<FetchResponse<200, types.SendPresenceResponse200>> {
    return this.core.fetch('/presences/{EntryID}', 'put', body, metadata);
  }

  /**
   * Get groups
   *
   * @throws FetchError<400, types.GetGroupsResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetGroupsResponse500> Internal Error
   */
  getGroups(metadata?: types.GetGroupsMetadataParam): Promise<FetchResponse<200, types.GetGroupsResponse200>> {
    return this.core.fetch('/groups', 'get', metadata);
  }

  /**
   * This method is responsible for creating a group with its respective participants. Just
   * like WhatsApp you will need to add at least one contact to be able to create a group.
   * Due to WhatsApp's anti-spam policy, some contacts are not automatically added to the
   * group. [Read more
   * here](https://support.whapi.cloud/help-desk/groups/add-new-member-to-group)
   *
   * @summary Create group
   * @throws FetchError<400, types.CreateGroupResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateGroupResponse401> Need channel authorization for add group
   * @throws FetchError<404, types.CreateGroupResponse404> Specified participant not found in contacts list
   * @throws FetchError<429, types.CreateGroupResponse429> Too many requests
   * @throws FetchError<500, types.CreateGroupResponse500> Internal Error
   */
  createGroup(body: types.CreateGroupBodyParam): Promise<FetchResponse<200, types.CreateGroupResponse200>> {
    return this.core.fetch('/groups', 'post', body);
  }

  /**
   * Allows you to join a group by knowing its invitation code
   *
   * @summary Accept group invite
   * @throws FetchError<400, types.AcceptGroupInviteResponse400> Wrong request parameters
   * @throws FetchError<401, types.AcceptGroupInviteResponse401> Need channel authorization for accept invite link
   * @throws FetchError<404, types.AcceptGroupInviteResponse404> Wrong invite code
   * @throws FetchError<500, types.AcceptGroupInviteResponse500> Internal Error
   */
  acceptGroupInvite(body: types.AcceptGroupInviteBodyParam): Promise<FetchResponse<200, types.AcceptGroupInviteResponse200>> {
    return this.core.fetch('/groups', 'put', body);
  }

  /**
   * This method returns the group metadata with all information about the group and its
   * participants
   *
   * @summary Get group
   * @throws FetchError<400, types.GetGroupResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetGroupResponse404> Specified group not found
   * @throws FetchError<500, types.GetGroupResponse500> Internal Error
   */
  getGroup(metadata: types.GetGroupMetadataParam): Promise<FetchResponse<200, types.GetGroupResponse200>> {
    return this.core.fetch('/groups/{GroupID}', 'get', metadata);
  }

  /**
   * This method is responsible for changing the name and description of a group that already
   * exists
   *
   * @summary Update group info
   * @throws FetchError<400, types.UpdateGroupInfoResponse400> Wrong request parameters
   * @throws FetchError<401, types.UpdateGroupInfoResponse401> Need channel authorization for update group
   * @throws FetchError<403, types.UpdateGroupInfoResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.UpdateGroupInfoResponse404> Specified group not found
   * @throws FetchError<500, types.UpdateGroupInfoResponse500> Internal Error
   */
  updateGroupInfo(body: types.UpdateGroupInfoBodyParam, metadata: types.UpdateGroupInfoMetadataParam): Promise<FetchResponse<200, types.UpdateGroupInfoResponse200>> {
    return this.core.fetch('/groups/{GroupID}', 'put', body, metadata);
  }

  /**
   * This method allows you to leave a group that you are a member of
   *
   * @summary Leave group
   * @throws FetchError<400, types.LeaveGroupResponse400> Wrong request parameters
   * @throws FetchError<401, types.LeaveGroupResponse401> Need channel authorization for leave group
   * @throws FetchError<404, types.LeaveGroupResponse404> Specified group not found
   * @throws FetchError<500, types.LeaveGroupResponse500> Internal Error
   */
  leaveGroup(metadata: types.LeaveGroupMetadataParam): Promise<FetchResponse<200, types.LeaveGroupResponse200>> {
    return this.core.fetch('/groups/{GroupID}', 'delete', metadata);
  }

  /**
   * This method is responsible for changing the privacy settings for group
   *
   * @summary Update group setting
   * @throws FetchError<400, types.UpdateGroupSettingResponse400> Wrong request parameters
   * @throws FetchError<401, types.UpdateGroupSettingResponse401> Need channel authorization for update group
   * @throws FetchError<403, types.UpdateGroupSettingResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.UpdateGroupSettingResponse404> Specified group not found
   * @throws FetchError<500, types.UpdateGroupSettingResponse500> Internal Error
   */
  updateGroupSetting(body: types.UpdateGroupSettingBodyParam, metadata: types.UpdateGroupSettingMetadataParam): Promise<FetchResponse<200, types.UpdateGroupSettingResponse200>> {
    return this.core.fetch('/groups/{GroupID}', 'patch', body, metadata);
  }

  /**
   * This method retrieves the ID of the group invitation. [What it is and how to work with
   * it](https://support.whapi.cloud/help-desk/groups/add-new-member-to-group#sending-an-invitation-to-a-group)
   *
   * @summary Get group invite
   * @throws FetchError<400, types.GetGroupInviteResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetGroupInviteResponse401> Need channel authorization for create invite link
   * @throws FetchError<403, types.GetGroupInviteResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.GetGroupInviteResponse404> Specified group not found
   * @throws FetchError<500, types.GetGroupInviteResponse500> Internal Error
   */
  getGroupInvite(metadata: types.GetGroupInviteMetadataParam): Promise<FetchResponse<200, types.GetGroupInviteResponse200>> {
    return this.core.fetch('/groups/{GroupID}/invite', 'get', metadata);
  }

  /**
   * Revoke group invite
   *
   * @throws FetchError<400, types.RevokeGroupInviteResponse400> Wrong request parameters
   * @throws FetchError<401, types.RevokeGroupInviteResponse401> Need channel authorization for delete invite link
   * @throws FetchError<404, types.RevokeGroupInviteResponse404> Specified group not found
   * @throws FetchError<500, types.RevokeGroupInviteResponse500> Internal Error
   */
  revokeGroupInvite(metadata: types.RevokeGroupInviteMetadataParam): Promise<FetchResponse<200, types.RevokeGroupInviteResponse200>> {
    return this.core.fetch('/groups/{GroupID}/invite', 'delete', metadata);
  }

  /**
   * This method is responsible for adding new members to the group. Due to WhatsApp's
   * anti-spam policy, some contacts are not automatically added to the group. [Read more
   * here](https://support.whapi.cloud/help-desk/groups/add-new-member-to-group)
   *
   * @summary Add group participant
   * @throws FetchError<400, types.AddGroupParticipantResponse400> Wrong request parameters
   * @throws FetchError<401, types.AddGroupParticipantResponse401> Need channel authorization for add participant
   * @throws FetchError<403, types.AddGroupParticipantResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.AddGroupParticipantResponse404> Specified group or participant not found
   * @throws FetchError<409, types.AddGroupParticipantResponse409> Specified participant already in group
   * @throws FetchError<500, types.AddGroupParticipantResponse500> Internal Error
   */
  addGroupParticipant(body: types.AddGroupParticipantBodyParam, metadata: types.AddGroupParticipantMetadataParam): Promise<FetchResponse<200, types.AddGroupParticipantResponse200>> {
    return this.core.fetch('/groups/{GroupID}/participants', 'post', body, metadata);
  }

  /**
   * This method is responsible for removing members of the group
   *
   * @summary Remove group participant
   * @throws FetchError<400, types.RemoveGroupParticipantResponse400> Wrong request parameters
   * @throws FetchError<401, types.RemoveGroupParticipantResponse401> Need channel authorization for remove participant
   * @throws FetchError<403, types.RemoveGroupParticipantResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.RemoveGroupParticipantResponse404> Specified group or participant not found
   * @throws FetchError<500, types.RemoveGroupParticipantResponse500> Internal Error
   */
  removeGroupParticipant(body: types.RemoveGroupParticipantBodyParam, metadata: types.RemoveGroupParticipantMetadataParam): Promise<FetchResponse<200, types.RemoveGroupParticipantResponse200>> {
    return this.core.fetch('/groups/{GroupID}/participants', 'delete', body, metadata);
  }

  /**
   * This method returns the profile image of group
   *
   * @summary Get group icon
   * @throws FetchError<400, types.GetGroupIconResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetGroupIconResponse401> Need channel authorization for get group icon
   * @throws FetchError<403, types.GetGroupIconResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.GetGroupIconResponse404> Specified group not found
   * @throws FetchError<500, types.GetGroupIconResponse500> Internal Error
   */
  getGroupIcon(metadata: types.GetGroupIconMetadataParam): Promise<FetchResponse<200, types.GetGroupIconResponse200> | FetchResponse<204, types.GetGroupIconResponse204>> {
    return this.core.fetch('/groups/{GroupID}/icon', 'get', metadata);
  }

  /**
   * This method is reponsibible for changing a group image that already exists
   *
   * @summary Set group icon
   * @throws FetchError<400, types.SetGroupIconResponse400> Wrong request parameters
   * @throws FetchError<401, types.SetGroupIconResponse401> Need channel authorization for set group icon
   * @throws FetchError<403, types.SetGroupIconResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.SetGroupIconResponse404> Specified group not found
   * @throws FetchError<500, types.SetGroupIconResponse500> Internal Error
   */
  setGroupIcon(body: types.SetGroupIconBodyParam, metadata: types.SetGroupIconMetadataParam): Promise<FetchResponse<200, types.SetGroupIconResponse200>> {
    return this.core.fetch('/groups/{GroupID}/icon', 'put', body, metadata);
  }

  /**
   * Delete group icon
   *
   * @throws FetchError<400, types.DeleteGroupIconResponse400> Wrong request parameters
   * @throws FetchError<401, types.DeleteGroupIconResponse401> Need channel authorization for delete group icon
   * @throws FetchError<403, types.DeleteGroupIconResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.DeleteGroupIconResponse404> Specified group not found
   * @throws FetchError<500, types.DeleteGroupIconResponse500> Internal Error
   */
  deleteGroupIcon(metadata: types.DeleteGroupIconMetadataParam): Promise<FetchResponse<200, types.DeleteGroupIconResponse200>> {
    return this.core.fetch('/groups/{GroupID}/icon', 'delete', metadata);
  }

  /**
   * This method is responsible for removing one or more admins from a group
   *
   * @summary Demote group admin
   * @throws FetchError<400, types.DemoteGroupAdminResponse400> Wrong request parameters
   * @throws FetchError<401, types.DemoteGroupAdminResponse401> Need channel authorization for demote group admin
   * @throws FetchError<403, types.DemoteGroupAdminResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.DemoteGroupAdminResponse404> Specified group or participant not found
   * @throws FetchError<500, types.DemoteGroupAdminResponse500> Internal Error
   */
  demoteGroupAdmin(body: types.DemoteGroupAdminBodyParam, metadata: types.DemoteGroupAdminMetadataParam): Promise<FetchResponse<200, types.DemoteGroupAdminResponse200>> {
    return this.core.fetch('/groups/{GroupID}/admins', 'delete', body, metadata);
  }

  /**
   * This method is responsible for promoting group members to admins, you can promote one or
   * more members to admins
   *
   * @summary Promote to group admin
   * @throws FetchError<400, types.PromoteToGroupAdminResponse400> Wrong request parameters
   * @throws FetchError<401, types.PromoteToGroupAdminResponse401> Need channel authorization for promote group admin
   * @throws FetchError<403, types.PromoteToGroupAdminResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.PromoteToGroupAdminResponse404> Specified group or participant not found
   * @throws FetchError<500, types.PromoteToGroupAdminResponse500> Internal Error
   */
  promoteToGroupAdmin(body: types.PromoteToGroupAdminBodyParam, metadata: types.PromoteToGroupAdminMetadataParam): Promise<FetchResponse<200, types.PromoteToGroupAdminResponse200>> {
    return this.core.fetch('/groups/{GroupID}/admins', 'patch', body, metadata);
  }

  /**
   * Send group invite link
   *
   * @throws FetchError<400, types.SendGroupInviteResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendGroupInviteResponse401> Need channel authorization for this action
   * @throws FetchError<402, types.SendGroupInviteResponse402> Trial version limit exceeded
   * @throws FetchError<404, types.SendGroupInviteResponse404> Specified group not found
   * @throws FetchError<429, types.SendGroupInviteResponse429> Too many requests
   * @throws FetchError<500, types.SendGroupInviteResponse500> Internal Error
   */
  sendGroupInvite(body: types.SendGroupInviteBodyParam, metadata: types.SendGroupInviteMetadataParam): Promise<FetchResponse<200, types.SendGroupInviteResponse200>> {
    return this.core.fetch('/groups/link/{InviteCode}', 'post', body, metadata);
  }

  /**
   * Get group info by invite code
   *
   * @throws FetchError<400, types.GetGroupMetadataByInviteCodeResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetGroupMetadataByInviteCodeResponse401> Need channel authorization for this action
   * @throws FetchError<404, types.GetGroupMetadataByInviteCodeResponse404> Specified group not found
   * @throws FetchError<429, types.GetGroupMetadataByInviteCodeResponse429> Too many requests
   * @throws FetchError<500, types.GetGroupMetadataByInviteCodeResponse500> Internal Error
   */
  getGroupMetadataByInviteCode(metadata: types.GetGroupMetadataByInviteCodeMetadataParam): Promise<FetchResponse<200, types.GetGroupMetadataByInviteCodeResponse200>> {
    return this.core.fetch('/groups/link/{InviteCode}', 'get', metadata);
  }

  /**
   * This method returns the list of join requests to the group
   *
   * @summary Get list of join requests to the group
   * @throws FetchError<400, types.GetGroupApplicationsListResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetGroupApplicationsListResponse404> Specified group not found
   * @throws FetchError<500, types.GetGroupApplicationsListResponse500> Internal Error
   */
  getGroupApplicationsList(metadata: types.GetGroupApplicationsListMetadataParam): Promise<FetchResponse<200, types.GetGroupApplicationsListResponse200>> {
    return this.core.fetch('/groups/{GroupID}/applications', 'get', metadata);
  }

  /**
   * This method returns the list with result of operation for each user
   *
   * @summary Accept group applications for listed users
   * @throws FetchError<400, types.ApproveGroupApplicationsListResponse400> Wrong request parameters
   * @throws FetchError<404, types.ApproveGroupApplicationsListResponse404> Specified group not found
   * @throws FetchError<500, types.ApproveGroupApplicationsListResponse500> Internal Error
   */
  approveGroupApplicationsList(body: types.ApproveGroupApplicationsListBodyParam, metadata: types.ApproveGroupApplicationsListMetadataParam): Promise<FetchResponse<200, types.ApproveGroupApplicationsListResponse200>> {
    return this.core.fetch('/groups/{GroupID}/applications', 'post', body, metadata);
  }

  /**
   * This method returns the list with result of operation for each user
   *
   * @summary Reject group applications for listed users
   * @throws FetchError<400, types.RejectGroupApplicationsListResponse400> Wrong request parameters
   * @throws FetchError<404, types.RejectGroupApplicationsListResponse404> Specified group not found
   * @throws FetchError<500, types.RejectGroupApplicationsListResponse500> Internal Error
   */
  rejectGroupApplicationsList(body: types.RejectGroupApplicationsListBodyParam, metadata: types.RejectGroupApplicationsListMetadataParam): Promise<FetchResponse<200, types.RejectGroupApplicationsListResponse200>> {
    return this.core.fetch('/groups/{GroupID}/applications', 'delete', body, metadata);
  }

  /**
   * Get list of stories
   *
   * @throws FetchError<400, types.GetStoriesResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetStoriesResponse500> Internal Error
   */
  getStories(metadata?: types.GetStoriesMetadataParam): Promise<FetchResponse<200, types.GetStoriesResponse200>> {
    return this.core.fetch('/stories', 'get', metadata);
  }

  /**
   * The method responsible for sending images or texts to your status. Remember that
   * statuses disappear after 24 hours. The requirements for [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary Create & publish story
   * @throws FetchError<400, types.CreateStoryResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateStoryResponse401> Need channel authorization for posting stories
   * @throws FetchError<402, types.CreateStoryResponse402> Trial version limit exceeded
   * @throws FetchError<404, types.CreateStoryResponse404> Media with specified id not found
   * @throws FetchError<413, types.CreateStoryResponse413> Request media too large
   * @throws FetchError<415, types.CreateStoryResponse415> Unsupported media type
   * @throws FetchError<429, types.CreateStoryResponse429> Too many requests
   * @throws FetchError<500, types.CreateStoryResponse500> Internal Error
   */
  createStory(body: types.CreateStoryBodyParam): Promise<FetchResponse<200, types.CreateStoryResponse200>> {
    return this.core.fetch('/stories', 'post', body);
  }

  /**
   * The method responsible for sending texts to your status. Remember that statuses
   * disappear after 24 hours.
   *
   * @summary 💬 Post text story
   * @throws FetchError<400, types.CreateStoryTextResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateStoryTextResponse401> Need channel authorization for posting stories
   * @throws FetchError<402, types.CreateStoryTextResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.CreateStoryTextResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.CreateStoryTextResponse404> Media with specified id not found
   * @throws FetchError<413, types.CreateStoryTextResponse413> Request media too large
   * @throws FetchError<415, types.CreateStoryTextResponse415> Unsupported media type
   * @throws FetchError<429, types.CreateStoryTextResponse429> Too many requests
   * @throws FetchError<500, types.CreateStoryTextResponse500> Internal Error
   */
  createStoryText(body: types.CreateStoryTextBodyParam): Promise<FetchResponse<200, types.CreateStoryTextResponse200>> {
    return this.core.fetch('/stories/send/text', 'post', body);
  }

  /**
   * The method responsible for sending images or video to your status. Remember that
   * statuses disappear after 24 hours. The requirements for [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 🖼 Post media story
   * @throws FetchError<400, types.CreateStoryMediaResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateStoryMediaResponse401> Need channel authorization for posting stories
   * @throws FetchError<402, types.CreateStoryMediaResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.CreateStoryMediaResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.CreateStoryMediaResponse404> Media with specified id not found
   * @throws FetchError<413, types.CreateStoryMediaResponse413> Request media too large
   * @throws FetchError<415, types.CreateStoryMediaResponse415> Unsupported media type
   * @throws FetchError<429, types.CreateStoryMediaResponse429> Too many requests
   * @throws FetchError<500, types.CreateStoryMediaResponse500> Internal Error
   */
  createStoryMedia(body: types.CreateStoryMediaBodyParam): Promise<FetchResponse<200, types.CreateStoryMediaResponse200>> {
    return this.core.fetch('/stories/send/media', 'post', body);
  }

  /**
   * The method responsible for sending audio to your status. Remember that statuses
   * disappear after 24 hours. The requirements for [sending all media types are
   * identical](https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document)
   *
   * @summary 🎵️ Post audio story
   * @throws FetchError<400, types.CreateStoryAudioResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateStoryAudioResponse401> Need channel authorization for posting stories
   * @throws FetchError<402, types.CreateStoryAudioResponse402> Trial version limit exceeded
   * @throws FetchError<403, types.CreateStoryAudioResponse403> It is forbidden to send to this group/recipient
   * @throws FetchError<404, types.CreateStoryAudioResponse404> Media with specified id not found
   * @throws FetchError<413, types.CreateStoryAudioResponse413> Request media too large
   * @throws FetchError<415, types.CreateStoryAudioResponse415> Unsupported media type
   * @throws FetchError<429, types.CreateStoryAudioResponse429> Too many requests
   * @throws FetchError<500, types.CreateStoryAudioResponse500> Internal Error
   */
  createStoryAudio(body: types.CreateStoryAudioBodyParam): Promise<FetchResponse<200, types.CreateStoryAudioResponse200>> {
    return this.core.fetch('/stories/send/audio', 'post', body);
  }

  /**
   * Get message or story view statuses
   *
   * @throws FetchError<400, types.GetMessageViewStatusesResponse400> Wrong request parameters
   * @throws FetchError<403, types.GetMessageViewStatusesResponse403> View statuses available only for outgoing messages
   * @throws FetchError<404, types.GetMessageViewStatusesResponse404> Specified message not found
   * @throws FetchError<500, types.GetMessageViewStatusesResponse500> Internal Error
   */
  getMessageViewStatuses(metadata: types.GetMessageViewStatusesMetadataParam): Promise<FetchResponse<200, types.GetMessageViewStatusesResponse200>> {
    return this.core.fetch('/statuses/{MessageID}', 'get', metadata);
  }

  /**
   * This method returns a list with metadata of your own WhatsApp Channel and followed
   * Channels, including all Channel information and their views.
   *
   * @summary Get newsletters
   * @throws FetchError<400, types.GetNewslettersResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetNewslettersResponse500> Internal Error
   */
  getNewsletters(metadata?: types.GetNewslettersMetadataParam): Promise<FetchResponse<200, types.GetNewslettersResponse200>> {
    return this.core.fetch('/newsletters', 'get', metadata);
  }

  /**
   * This method is responsible for creating a WhatsApp Channel. [How to send a post to
   * WhatsApp
   * Channel](https://support.whapi.cloud/help-desk/channels/send-post-to-whatsapp-channel)
   *
   * @summary Create newsletter
   * @throws FetchError<400, types.CreateNewsletterResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateNewsletterResponse401> Need channel authorization for add group
   * @throws FetchError<404, types.CreateNewsletterResponse404> Specified participant not found in contacts list
   * @throws FetchError<429, types.CreateNewsletterResponse429> Too many requests
   * @throws FetchError<500, types.CreateNewsletterResponse500> Internal Error
   */
  createNewsletter(body: types.CreateNewsletterBodyParam): Promise<FetchResponse<200, types.CreateNewsletterResponse200>> {
    return this.core.fetch('/newsletters', 'post', body);
  }

  /**
   * This method returns a list of WhatsApp Channels data based on the search performed using
   * filters provided in the request body
   *
   * @summary Find newsletters by filters
   * @throws FetchError<400, types.FindNewsletterResponse400> Wrong request parameters
   * @throws FetchError<404, types.FindNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<500, types.FindNewsletterResponse500> Internal Error
   */
  findNewsletter(metadata?: types.FindNewsletterMetadataParam): Promise<FetchResponse<200, types.FindNewsletterResponse200>> {
    return this.core.fetch('/newsletters/find', 'get', metadata);
  }

  /**
   * This method returns a list of WhatsApp Channels data based on the search performed using
   * filters provided in the request body
   *
   * @summary Get recommended newsletters by country
   * @throws FetchError<400, types.RecommendedNewsletterResponse400> Wrong request parameters
   * @throws FetchError<404, types.RecommendedNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<500, types.RecommendedNewsletterResponse500> Internal Error
   */
  recommendedNewsletter(metadata?: types.RecommendedNewsletterMetadataParam): Promise<FetchResponse<200, types.RecommendedNewsletterResponse200>> {
    return this.core.fetch('/newsletters/recommended', 'get', metadata);
  }

  /**
   * This method returns the metadata of a WhatsApp Channel, including all newsletter
   * information and its views
   *
   * @summary Get newsletter information
   * @throws FetchError<400, types.GetNewsletterResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<500, types.GetNewsletterResponse500> Internal Error
   */
  getNewsletter(metadata: types.GetNewsletterMetadataParam): Promise<FetchResponse<200, types.GetNewsletterResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}', 'get', metadata);
  }

  /**
   * This method is responsible for deleting a WhatsApp Channel
   *
   * @summary Delete newsletter
   * @throws FetchError<400, types.DeleteNewsletterResponse400> Wrong request parameters
   * @throws FetchError<401, types.DeleteNewsletterResponse401> Need to be owner of newsletter
   * @throws FetchError<404, types.DeleteNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<500, types.DeleteNewsletterResponse500> Internal Error
   */
  deleteNewsletter(metadata: types.DeleteNewsletterMetadataParam): Promise<FetchResponse<200, types.DeleteNewsletterResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}', 'delete', metadata);
  }

  /**
   * This method is responsible for editing a WhatsApp Newsletter Channel
   *
   * @summary Edit newsletter
   * @throws FetchError<400, types.EditNewsletterResponse400> Wrong request parameters
   * @throws FetchError<401, types.EditNewsletterResponse401> Need admin permissions for edit newsletter
   * @throws FetchError<404, types.EditNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<429, types.EditNewsletterResponse429> Too many requests
   * @throws FetchError<500, types.EditNewsletterResponse500> Internal Error
   */
  editNewsletter(body: types.EditNewsletterBodyParam, metadata: types.EditNewsletterMetadataParam): Promise<FetchResponse<200, types.EditNewsletterResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}', 'patch', body, metadata);
  }

  /**
   * This method is responsible for following a WhatsApp Channel
   *
   * @summary Subscribe to newsletter
   * @throws FetchError<400, types.SubscribeNewsletterResponse400> Wrong request parameters
   * @throws FetchError<404, types.SubscribeNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<500, types.SubscribeNewsletterResponse500> Internal Error
   */
  subscribeNewsletter(metadata: types.SubscribeNewsletterMetadataParam): Promise<FetchResponse<200, types.SubscribeNewsletterResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}/subscription', 'post', metadata);
  }

  /**
   * This method is responsible for unfollowing a WhatsApp Channel
   *
   * @summary Unsubscribe from newsletter
   * @throws FetchError<400, types.UnsubscribeNewsletterResponse400> Wrong request parameters
   * @throws FetchError<404, types.UnsubscribeNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<500, types.UnsubscribeNewsletterResponse500> Internal Error
   */
  unsubscribeNewsletter(metadata: types.UnsubscribeNewsletterMetadataParam): Promise<FetchResponse<200, types.UnsubscribeNewsletterResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}/subscription', 'delete', metadata);
  }

  /**
   * This method is responsible for following a WhatsApp Channel
   *
   * @summary Subscribe to newsletter by invite code
   * @throws FetchError<400, types.SubscribeNewsletterInviteResponse400> Wrong request parameters
   * @throws FetchError<404, types.SubscribeNewsletterInviteResponse404> Specified newsletter not found
   * @throws FetchError<500, types.SubscribeNewsletterInviteResponse500> Internal Error
   */
  subscribeNewsletterInvite(metadata: types.SubscribeNewsletterInviteMetadataParam): Promise<FetchResponse<200, types.SubscribeNewsletterInviteResponse200>> {
    return this.core.fetch('/newsletters/invite/{NewsletterInviteCode}/subscription', 'post', metadata);
  }

  /**
   * This method is responsible for unfollowing a WhatsApp Channel
   *
   * @summary Unsubscribe from newsletter by invite code
   * @throws FetchError<400, types.UnsubscribeNewsletterInviteResponse400> Wrong request parameters
   * @throws FetchError<404, types.UnsubscribeNewsletterInviteResponse404> Specified newsletter not found
   * @throws FetchError<500, types.UnsubscribeNewsletterInviteResponse500> Internal Error
   */
  unsubscribeNewsletterInvite(metadata: types.UnsubscribeNewsletterInviteMetadataParam): Promise<FetchResponse<200, types.UnsubscribeNewsletterInviteResponse200>> {
    return this.core.fetch('/newsletters/invite/{NewsletterInviteCode}/subscription', 'delete', metadata);
  }

  /**
   * It is necessary to receive notifications about new votes in the polls
   *
   * @summary Subscribe to newsletter updates
   * @throws FetchError<400, types.TrackingNewsletterResponse400> Wrong request parameters
   * @throws FetchError<404, types.TrackingNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<500, types.TrackingNewsletterResponse500> Internal Error
   */
  trackingNewsletter(metadata: types.TrackingNewsletterMetadataParam): Promise<FetchResponse<200, types.TrackingNewsletterResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}/tracking', 'post', metadata);
  }

  /**
   * The method returns the history of WhatsApp Channel messages
   *
   * @summary Get newsletter messages
   * @throws FetchError<400, types.GetMessagesNewsletterResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetMessagesNewsletterResponse404> Specified newsletter not found
   * @throws FetchError<500, types.GetMessagesNewsletterResponse500> Internal Error
   */
  getMessagesNewsletter(metadata: types.GetMessagesNewsletterMetadataParam): Promise<FetchResponse<200, types.GetMessagesNewsletterResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}/messages', 'get', metadata);
  }

  /**
   * This method is responsible for sending an invitation for WhatsApp Channel administrator.
   * Once the invitation is created, an invitation message will be sent to the contact
   *
   * @summary Create Newsletter admin-invite
   * @throws FetchError<400, types.CreateNewsletterAdminInviteResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateNewsletterAdminInviteResponse401> Need channel authorization for this action
   * @throws FetchError<404, types.CreateNewsletterAdminInviteResponse404> Specified newsletter not found
   * @throws FetchError<500, types.CreateNewsletterAdminInviteResponse500> Internal Error
   */
  createNewsletterAdminInvite(body: types.CreateNewsletterAdminInviteBodyParam, metadata: types.CreateNewsletterAdminInviteMetadataParam): Promise<FetchResponse<200, types.CreateNewsletterAdminInviteResponse200>>;
  createNewsletterAdminInvite(metadata: types.CreateNewsletterAdminInviteMetadataParam): Promise<FetchResponse<200, types.CreateNewsletterAdminInviteResponse200>>;
  createNewsletterAdminInvite(body?: types.CreateNewsletterAdminInviteBodyParam | types.CreateNewsletterAdminInviteMetadataParam, metadata?: types.CreateNewsletterAdminInviteMetadataParam): Promise<FetchResponse<200, types.CreateNewsletterAdminInviteResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}/invite/{ContactID}', 'post', body, metadata);
  }

  /**
   * This method is responsible for revoking an invitation for WhatsApp Channel
   * administrator.
   *
   * @summary Revoke Newsletter admin-invite
   * @throws FetchError<400, types.RevokeNewsletterAdminInviteResponse400> Wrong request parameters
   * @throws FetchError<401, types.RevokeNewsletterAdminInviteResponse401> Need channel authorization for this action
   * @throws FetchError<404, types.RevokeNewsletterAdminInviteResponse404> Specified newsletter not found
   * @throws FetchError<500, types.RevokeNewsletterAdminInviteResponse500> Internal Error
   */
  revokeNewsletterAdminInvite(metadata: types.RevokeNewsletterAdminInviteMetadataParam): Promise<FetchResponse<200, types.RevokeNewsletterAdminInviteResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}/invite/{ContactID}', 'delete', metadata);
  }

  /**
   * This method is responsible for accepting an request to become an administrator of a
   * WhatsApp Channel. This request is a message that you can both send like invitation and
   * receive through the received message webhook
   *
   * @summary Accept Newsletter admin-request
   * @throws FetchError<400, types.AcceptNewsletterAdminRequestResponse400> Wrong request parameters
   * @throws FetchError<401, types.AcceptNewsletterAdminRequestResponse401> Need channel authorization for this action
   * @throws FetchError<404, types.AcceptNewsletterAdminRequestResponse404> Specified newsletter not found
   * @throws FetchError<500, types.AcceptNewsletterAdminRequestResponse500> Internal Error
   */
  acceptNewsletterAdminRequest(metadata: types.AcceptNewsletterAdminRequestMetadataParam): Promise<FetchResponse<200, types.AcceptNewsletterAdminRequestResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}/admins/{ContactID}', 'put', metadata);
  }

  /**
   * This method is responsible for removing a user from the administration of the WhatsApp
   * Channel
   *
   * @summary Demote Newsletter admin
   * @throws FetchError<400, types.DemoteNewsletterAdminResponse400> Wrong request parameters
   * @throws FetchError<401, types.DemoteNewsletterAdminResponse401> Need channel authorization for this action
   * @throws FetchError<404, types.DemoteNewsletterAdminResponse404> Specified newsletter not found
   * @throws FetchError<500, types.DemoteNewsletterAdminResponse500> Internal Error
   */
  demoteNewsletterAdmin(metadata: types.DemoteNewsletterAdminMetadataParam): Promise<FetchResponse<200, types.DemoteNewsletterAdminResponse200>> {
    return this.core.fetch('/newsletters/{NewsletterID}/admins/{ContactID}', 'delete', metadata);
  }

  /**
   * Send newsletter invite link
   *
   * @throws FetchError<400, types.SendNewsletterInviteResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendNewsletterInviteResponse401> Need channel authorization for this action
   * @throws FetchError<404, types.SendNewsletterInviteResponse404> Specified newsletter not found
   * @throws FetchError<429, types.SendNewsletterInviteResponse429> Too many requests
   * @throws FetchError<500, types.SendNewsletterInviteResponse500> Internal Error
   */
  sendNewsletterInvite(body: types.SendNewsletterInviteBodyParam, metadata: types.SendNewsletterInviteMetadataParam): Promise<FetchResponse<200, types.SendNewsletterInviteResponse200>> {
    return this.core.fetch('/newsletters/link/{NewsletterInviteCode}', 'post', body, metadata);
  }

  /**
   * Get newsletter info by invite code
   *
   * @throws FetchError<400, types.GetNewsletterByInviteCodeResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetNewsletterByInviteCodeResponse401> Need channel authorization for this action
   * @throws FetchError<404, types.GetNewsletterByInviteCodeResponse404> Specified newsletter not found
   * @throws FetchError<429, types.GetNewsletterByInviteCodeResponse429> Too many requests
   * @throws FetchError<500, types.GetNewsletterByInviteCodeResponse500> Internal Error
   */
  getNewsletterByInviteCode(metadata: types.GetNewsletterByInviteCodeMetadataParam): Promise<FetchResponse<200, types.GetNewsletterByInviteCodeResponse200>> {
    return this.core.fetch('/newsletters/link/{NewsletterInviteCode}', 'get', metadata);
  }

  /**
   * This method is used to upload a file to cloud storage. In the response, you will receive
   * the MediaID for the uploaded file, which can be used later, for example, to send media
   * messages. The file type are determined by the file extension. [Read more about file
   * storage period.](https://support.whapi.cloud/help-desk/receiving/file-expiration-period)
   *
   * @summary Upload media
   * @throws FetchError<400, types.UploadMediaResponse400> Wrong request parameters
   * @throws FetchError<401, types.UploadMediaResponse401> Need channel authorization for upload media
   * @throws FetchError<500, types.UploadMediaResponse500> Internal Error
   */
  uploadMedia(body: types.UploadMediaBodyParam): Promise<FetchResponse<200, types.UploadMediaResponse200>> {
    return this.core.fetch('/media', 'post', body);
  }

  /**
   * This method is responsible for returning all of your media files
   *
   * @summary Get media files
   * @throws FetchError<400, types.GetMediaFilesResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetMediaFilesResponse500> Internal Error
   */
  getMediaFiles(metadata?: types.GetMediaFilesMetadataParam): Promise<FetchResponse<200, types.GetMediaFilesResponse200>> {
    return this.core.fetch('/media', 'get', metadata);
  }

  /**
   * Receive a file from the cloud by ID. [Read more about file storage
   * period.](https://support.whapi.cloud/help-desk/receiving/file-expiration-period)
   *
   * @summary Get media
   * @throws FetchError<400, types.GetMediaResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetMediaResponse404> Specified media not found
   * @throws FetchError<500, types.GetMediaResponse500> Internal Error
   */
  getMedia(metadata: types.GetMediaMetadataParam): Promise<FetchResponse<200, types.GetMediaResponse200>> {
    return this.core.fetch('/media/{MediaID}', 'get', metadata);
  }

  /**
   * Delete a file from the cloud by ID
   *
   * @summary Delete media
   * @throws FetchError<400, types.DeleteMediaResponse400> Wrong request parameters
   * @throws FetchError<404, types.DeleteMediaResponse404> Specified media not found
   * @throws FetchError<500, types.DeleteMediaResponse500> Internal Error
   */
  deleteMedia(metadata: types.DeleteMediaMetadataParam): Promise<FetchResponse<200, types.DeleteMediaResponse200>> {
    return this.core.fetch('/media/{MediaID}', 'delete', metadata);
  }

  /**
   * Through this method, it is possible to add the contact on the disallowed list
   * (blacklist). This will restrict the specified numbers to certain interactions with your
   * account
   *
   * @summary Add contact to blacklist
   * @throws FetchError<400, types.BlacklistAddResponse400> Wrong request parameters
   * @throws FetchError<404, types.BlacklistAddResponse404> Specified contact not found
   * @throws FetchError<500, types.BlacklistAddResponse500> Internal Error
   */
  blacklistAdd(metadata: types.BlacklistAddMetadataParam): Promise<FetchResponse<200, types.BlacklistAddResponse200>> {
    return this.core.fetch('/blacklist/{ContactID}', 'put', metadata);
  }

  /**
   * Through this method, it is possible to remove the contact on the disallowed list
   * (blacklist)
   *
   * @summary Remove contact from blacklist
   * @throws FetchError<400, types.BlacklistRemoveResponse400> Wrong request parameters
   * @throws FetchError<404, types.BlacklistRemoveResponse404> Specified contact not found
   * @throws FetchError<500, types.BlacklistRemoveResponse500> Internal Error
   */
  blacklistRemove(metadata: types.BlacklistRemoveMetadataParam): Promise<FetchResponse<200, types.BlacklistRemoveResponse200>> {
    return this.core.fetch('/blacklist/{ContactID}', 'delete', metadata);
  }

  /**
   * The method allows you to get information about your WhatsApp Business profile
   *
   * @summary Get business profile
   * @throws FetchError<400, types.GetBusinessProfileResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetBusinessProfileResponse401> Need channel authorization for getting products
   * @throws FetchError<500, types.GetBusinessProfileResponse500> Internal Error
   */
  getBusinessProfile(): Promise<FetchResponse<200, types.GetBusinessProfileResponse200>> {
    return this.core.fetch('/business', 'get');
  }

  /**
   * The method allows you to edit information of your WhatsApp Business profile
   *
   * @summary Edit your Business Profile
   * @throws FetchError<400, types.EditBusinessProfileResponse400> Wrong request parameters
   * @throws FetchError<401, types.EditBusinessProfileResponse401> Need channel authorization for getting products
   * @throws FetchError<429, types.EditBusinessProfileResponse429> Too many requests
   * @throws FetchError<500, types.EditBusinessProfileResponse500> Internal Error
   */
  editBusinessProfile(body?: types.EditBusinessProfileBodyParam): Promise<FetchResponse<200, types.EditBusinessProfileResponse200>> {
    return this.core.fetch('/business', 'post', body);
  }

  /**
   * With this method you will be able to get the products from a Whatsapp Business catalog
   *
   * @summary Get products
   * @throws FetchError<400, types.GetProductsResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetProductsResponse401> Need channel authorization for getting products
   * @throws FetchError<429, types.GetProductsResponse429> Too many requests
   * @throws FetchError<500, types.GetProductsResponse500> Internal Error
   */
  getProducts(metadata?: types.GetProductsMetadataParam): Promise<FetchResponse<200, types.GetProductsResponse200>> {
    return this.core.fetch('/business/products', 'get', metadata);
  }

  /**
   * In this method you will be able to register a product in your catalog
   *
   * @summary Create product
   * @throws FetchError<400, types.CreateProductResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateProductResponse401> Need channel authorization for getting products
   * @throws FetchError<429, types.CreateProductResponse429> Too many requests
   * @throws FetchError<500, types.CreateProductResponse500> Internal Error
   */
  createProduct(body: types.CreateProductBodyParam): Promise<FetchResponse<200, types.CreateProductResponse200>> {
    return this.core.fetch('/business/products', 'post', body);
  }

  /**
   * This method allows you to get the catalog and products by [Chat
   * ID](https://support.whapi.cloud/help-desk/faq/chat-id.-what-is-it-and-how-to-get-it),
   * even if it is not in your contact list
   *
   * @summary Get products by Contact ID
   * @throws FetchError<400, types.GetContactProductsResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetContactProductsResponse401> Need channel authorization for getting products
   * @throws FetchError<404, types.GetContactProductsResponse404> Specified user not found
   * @throws FetchError<500, types.GetContactProductsResponse500> Internal Error
   */
  getContactProducts(metadata: types.GetContactProductsMetadataParam): Promise<FetchResponse<200, types.GetContactProductsResponse200>> {
    return this.core.fetch('/business/{ContactID}/products', 'get', metadata);
  }

  /**
   * In this method you will be able to get your product by its ID
   *
   * @summary Get product
   * @throws FetchError<400, types.GetProductResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetProductResponse401> Need channel authorization for getting products
   * @throws FetchError<404, types.GetProductResponse404> Specified product not found
   * @throws FetchError<500, types.GetProductResponse500> Internal Error
   */
  getProduct(metadata: types.GetProductMetadataParam): Promise<FetchResponse<200, types.GetProductResponse200>> {
    return this.core.fetch('/business/products/{ProductID}', 'get', metadata);
  }

  /**
   * The method is for sending an item from your catalog
   *
   * @summary Send product
   * @throws FetchError<400, types.SendProductResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendProductResponse401> Need channel authorization for add contact
   * @throws FetchError<404, types.SendProductResponse404> Specified product not found
   * @throws FetchError<429, types.SendProductResponse429> Too many requests
   * @throws FetchError<500, types.SendProductResponse500> Internal Error
   */
  sendProduct(body: types.SendProductBodyParam, metadata: types.SendProductMetadataParam): Promise<FetchResponse<200, types.SendProductResponse200>> {
    return this.core.fetch('/business/products/{ProductID}', 'post', body, metadata);
  }

  /**
   * The *images* field is required and must contain all images
   *
   * @summary Update product
   * @throws FetchError<400, types.UpdateProductResponse400> Wrong request parameters
   * @throws FetchError<401, types.UpdateProductResponse401> Need channel authorization for update product
   * @throws FetchError<404, types.UpdateProductResponse404> Specified product not found
   * @throws FetchError<429, types.UpdateProductResponse429> Too many requests
   * @throws FetchError<500, types.UpdateProductResponse500> Internal Error
   */
  updateProduct(body: types.UpdateProductBodyParam, metadata: types.UpdateProductMetadataParam): Promise<FetchResponse<200, types.UpdateProductResponse200>> {
    return this.core.fetch('/business/products/{ProductID}', 'patch', body, metadata);
  }

  /**
   * In this method you will be able to delete a product by its ID
   *
   * @summary Delete product
   * @throws FetchError<400, types.DeleteProductResponse400> Wrong request parameters
   * @throws FetchError<401, types.DeleteProductResponse401> Need channel authorization for update product
   * @throws FetchError<404, types.DeleteProductResponse404> Specified product not found
   * @throws FetchError<429, types.DeleteProductResponse429> Too many requests
   * @throws FetchError<500, types.DeleteProductResponse500> Internal Error
   */
  deleteProduct(metadata: types.DeleteProductMetadataParam): Promise<FetchResponse<200, types.DeleteProductResponse200>> {
    return this.core.fetch('/business/products/{ProductID}', 'delete', metadata);
  }

  /**
   * The method allows you to get information about the items in the shopping cart sent to
   * you in messages. Note! Use the token as a Query (as in a get request). [More details in
   * the knowledge
   * base](https://support.whapi.cloud/help-desk/receiving/http-api/get-order-items)
   *
   * @summary Get order items
   * @throws FetchError<401, types.GetOrderItemsResponse401> Need channel authorization for getting products
   * @throws FetchError<403, types.GetOrderItemsResponse403> Need order token for getting products
   * @throws FetchError<404, types.GetOrderItemsResponse404> Specified order not found
   * @throws FetchError<500, types.GetOrderItemsResponse500> Internal Error
   */
  getOrderItems(metadata: types.GetOrderItemsMetadataParam): Promise<FetchResponse<200, types.GetOrderItemsResponse200>> {
    return this.core.fetch('/business/orders/{OrderID}', 'get', metadata);
  }

  /**
   * Send catalog by Contact ID (phone number)
   *
   * @throws FetchError<400, types.SendCatalogResponse400> Wrong request parameters
   * @throws FetchError<401, types.SendCatalogResponse401> Need channel authorization for send catalog
   * @throws FetchError<404, types.SendCatalogResponse404> Specified contact not found
   * @throws FetchError<429, types.SendCatalogResponse429> Too many requests
   * @throws FetchError<500, types.SendCatalogResponse500> Internal Error
   */
  sendCatalog(body: types.SendCatalogBodyParam, metadata: types.SendCatalogMetadataParam): Promise<FetchResponse<200, types.SendCatalogResponse200>> {
    return this.core.fetch('/business/catalogs/{ContactID}', 'post', body, metadata);
  }

  /**
   * Create business collection
   *
   * @summary Create collection
   * @throws FetchError<400, types.CreateCollectionResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateCollectionResponse401> Need channel authorization for creating collection
   * @throws FetchError<429, types.CreateCollectionResponse429> Too many requests
   * @throws FetchError<500, types.CreateCollectionResponse500> Internal Error
   */
  createCollection(body: types.CreateCollectionBodyParam): Promise<FetchResponse<200, types.CreateCollectionResponse200>> {
    return this.core.fetch('/business/collections', 'post', body);
  }

  /**
   * With this method you will be able to get the collections list from a Whatsapp Business
   * catalog
   *
   * @summary Get collections
   * @throws FetchError<400, types.GetCollectionsListResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetCollectionsListResponse401> Need channel authorization for getting collection
   * @throws FetchError<429, types.GetCollectionsListResponse429> Too many requests
   * @throws FetchError<500, types.GetCollectionsListResponse500> Internal Error
   */
  getCollectionsList(metadata?: types.GetCollectionsListMetadataParam): Promise<FetchResponse<200, types.GetCollectionsListResponse200>> {
    return this.core.fetch('/business/collections', 'get', metadata);
  }

  /**
   * With this method you will be able to get business collection
   *
   * @summary Get collection
   * @throws FetchError<400, types.GetCollectionResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetCollectionResponse401> Need channel authorization for getting collection
   * @throws FetchError<429, types.GetCollectionResponse429> Too many requests
   * @throws FetchError<500, types.GetCollectionResponse500> Internal Error
   */
  getCollection(metadata: types.GetCollectionMetadataParam): Promise<FetchResponse<200, types.GetCollectionResponse200>> {
    return this.core.fetch('/business/collections/{CollectionID}', 'get', metadata);
  }

  /**
   * With this method you will be able to edit business collection
   *
   * @summary Edit collection
   * @throws FetchError<400, types.EditCollectionResponse400> Wrong request parameters
   * @throws FetchError<401, types.EditCollectionResponse401> Need channel authorization for editing collection
   * @throws FetchError<429, types.EditCollectionResponse429> Too many requests
   * @throws FetchError<500, types.EditCollectionResponse500> Internal Error
   */
  editCollection(body: types.EditCollectionBodyParam, metadata: types.EditCollectionMetadataParam): Promise<FetchResponse<200, types.EditCollectionResponse200>> {
    return this.core.fetch('/business/collections/{CollectionID}', 'patch', body, metadata);
  }

  /**
   * Method to delete business collection
   *
   * @summary Delete collection
   * @throws FetchError<400, types.DeleteCollectionResponse400> Wrong request parameters
   * @throws FetchError<401, types.DeleteCollectionResponse401> Need channel authorization to delete collection
   * @throws FetchError<429, types.DeleteCollectionResponse429> Too many requests
   * @throws FetchError<500, types.DeleteCollectionResponse500> Internal Error
   */
  deleteCollection(metadata: types.DeleteCollectionMetadataParam): Promise<FetchResponse<200, types.DeleteCollectionResponse200>> {
    return this.core.fetch('/business/collections/{CollectionID}', 'delete', metadata);
  }

  /**
   * In this method, you retrieve all your registered labels in your WhatsApp Business
   *
   * @summary Get labels
   * @throws FetchError<400, types.GetLabelsResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetLabelsResponse500> Internal Error
   */
  getLabels(): Promise<FetchResponse<200, types.GetLabelsResponse200>> {
    return this.core.fetch('/labels', 'get');
  }

  /**
   * Create label
   *
   * @summary Create label
   * @throws FetchError<400, types.CreateLabelResponse400> Wrong request parameters
   * @throws FetchError<500, types.CreateLabelResponse500> Internal Error
   */
  createLabel(body: types.CreateLabelBodyParam): Promise<FetchResponse<200, types.CreateLabelResponse200>> {
    return this.core.fetch('/labels', 'post', body);
  }

  /**
   * Get objects associated with label
   *
   * @throws FetchError<400, types.GetLabelAssociationsResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetLabelAssociationsResponse404> Specified label not found
   * @throws FetchError<500, types.GetLabelAssociationsResponse500> Internal Error
   */
  getLabelAssociations(metadata: types.GetLabelAssociationsMetadataParam): Promise<FetchResponse<200, types.GetLabelAssociationsResponse200>> {
    return this.core.fetch('/labels/{LabelID}', 'get', metadata);
  }

  /**
   * Through this method, it is possible to assign a label to a chat in WhatsApp Business
   *
   * @summary Add label association
   * @throws FetchError<400, types.AddLabelAssociationResponse400> Wrong request parameters
   * @throws FetchError<401, types.AddLabelAssociationResponse401> Need channel authorization for add label association
   * @throws FetchError<404, types.AddLabelAssociationResponse404> Specified chat or message not found
   * @throws FetchError<409, types.AddLabelAssociationResponse409> Label association already exists
   * @throws FetchError<500, types.AddLabelAssociationResponse500> Internal Error
   */
  addLabelAssociation(metadata: types.AddLabelAssociationMetadataParam): Promise<FetchResponse<200, types.AddLabelAssociationResponse200>> {
    return this.core.fetch('/labels/{LabelID}/{AssociationID}', 'post', metadata);
  }

  /**
   * Through this method, it is possible to remove the labels from a chat in WhatsApp
   * Business
   *
   * @summary Delete label association
   * @throws FetchError<400, types.DeleteLabelAssociationResponse400> Wrong request parameters
   * @throws FetchError<401, types.DeleteLabelAssociationResponse401> Need channel authorization for delete label association
   * @throws FetchError<404, types.DeleteLabelAssociationResponse404> Specified association not found
   * @throws FetchError<500, types.DeleteLabelAssociationResponse500> Internal Error
   */
  deleteLabelAssociation(metadata: types.DeleteLabelAssociationMetadataParam): Promise<FetchResponse<200, types.DeleteLabelAssociationResponse200>> {
    return this.core.fetch('/labels/{LabelID}/{AssociationID}', 'delete', metadata);
  }

  /**
   * Sandbox as well as Trials have some limitations. This endpoint allows you to get
   * information about the remaining and used limits on your channel
   *
   * @summary Get limits
   * @throws FetchError<500, types.GetLimitsResponse500> Internal Error
   */
  getLimits(): Promise<FetchResponse<200, types.GetLimitsResponse200> | FetchResponse<204, types.GetLimitsResponse204>> {
    return this.core.fetch('/limits', 'get');
  }

  /**
   * This method is responsible for get a communities. [Learn more about the nuances of
   * community:](https://support.whapi.cloud/help-desk/communities/introduction)
   *
   * @summary Get communities
   * @throws FetchError<400, types.GetCommunitiesResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetCommunitiesResponse401> Need channel authorization to get info
   * @throws FetchError<500, types.GetCommunitiesResponse500> Internal Error
   */
  getCommunities(metadata?: types.GetCommunitiesMetadataParam): Promise<FetchResponse<200, types.GetCommunitiesResponse200>> {
    return this.core.fetch('/communities', 'get', metadata);
  }

  /**
   * This method is responsible for creating a community. [Learn more about the nuances of
   * community:](https://support.whapi.cloud/help-desk/communities/introduction)
   *
   * @summary Create community
   * @throws FetchError<400, types.CreateCommunityResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateCommunityResponse401> Need channel authorization for add community
   * @throws FetchError<500, types.CreateCommunityResponse500> Internal Error
   */
  createCommunity(body: types.CreateCommunityBodyParam): Promise<FetchResponse<200, types.CreateCommunityResponse200>> {
    return this.core.fetch('/communities', 'post', body);
  }

  /**
   * This method is responsible for get a community. [Learn more about the nuances of
   * community:](https://support.whapi.cloud/help-desk/communities/introduction)
   *
   * @summary Get community
   * @throws FetchError<400, types.GetCommunityResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetCommunityResponse401> Need channel authorization to get info
   * @throws FetchError<404, types.GetCommunityResponse404> Community not found
   * @throws FetchError<500, types.GetCommunityResponse500> Internal Error
   */
  getCommunity(metadata: types.GetCommunityMetadataParam): Promise<FetchResponse<200, types.GetCommunityResponse200>> {
    return this.core.fetch('/communities/{CommunityID}', 'get', metadata);
  }

  /**
   * This method is responsible for deactivate community.
   *
   * @summary Deactivate community
   * @throws FetchError<400, types.DeactivateCommunityResponse400> Wrong request parameters
   * @throws FetchError<401, types.DeactivateCommunityResponse401> Need channel authorization
   * @throws FetchError<403, types.DeactivateCommunityResponse403> Not permission
   * @throws FetchError<404, types.DeactivateCommunityResponse404> Community not found
   * @throws FetchError<500, types.DeactivateCommunityResponse500> Internal Error
   */
  deactivateCommunity(metadata: types.DeactivateCommunityMetadataParam): Promise<FetchResponse<200, types.DeactivateCommunityResponse200>> {
    return this.core.fetch('/communities/{CommunityID}', 'delete', metadata);
  }

  /**
   * Revoke community invite
   *
   * @throws FetchError<400, types.RevokeCommunityInviteResponse400> Wrong request parameters
   * @throws FetchError<401, types.RevokeCommunityInviteResponse401> Need channel authorization for delete invite link
   * @throws FetchError<404, types.RevokeCommunityInviteResponse404> Specified community not found
   * @throws FetchError<500, types.RevokeCommunityInviteResponse500> Internal Error
   */
  revokeCommunityInvite(metadata: types.RevokeCommunityInviteMetadataParam): Promise<FetchResponse<200, types.RevokeCommunityInviteResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/revokeInviteUrl', 'delete', metadata);
  }

  /**
   * This method is responsible for unlink group from community.
   *
   * @summary Unlink group from community
   * @throws FetchError<400, types.UnlinkGroupFromCommunityResponse400> Wrong request parameters
   * @throws FetchError<401, types.UnlinkGroupFromCommunityResponse401> Need channel authorization
   * @throws FetchError<403, types.UnlinkGroupFromCommunityResponse403> Not permission
   * @throws FetchError<404, types.UnlinkGroupFromCommunityResponse404> Community not found
   * @throws FetchError<500, types.UnlinkGroupFromCommunityResponse500> Internal Error
   */
  unlinkGroupFromCommunity(metadata: types.UnlinkGroupFromCommunityMetadataParam): Promise<FetchResponse<200, types.UnlinkGroupFromCommunityResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/{GroupID}', 'delete', metadata);
  }

  /**
   * This method is responsible for link group to community.
   *
   * @summary Link group to community
   * @throws FetchError<400, types.LinkGroupToCommunityResponse400> Wrong request parameters
   * @throws FetchError<401, types.LinkGroupToCommunityResponse401> Need channel authorization
   * @throws FetchError<403, types.LinkGroupToCommunityResponse403> Not permission
   * @throws FetchError<404, types.LinkGroupToCommunityResponse404> Community not found
   * @throws FetchError<500, types.LinkGroupToCommunityResponse500> Internal Error
   */
  linkGroupToCommunity(metadata: types.LinkGroupToCommunityMetadataParam): Promise<FetchResponse<200, types.LinkGroupToCommunityResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/{GroupID}', 'put', metadata);
  }

  /**
   * This method is responsible for join in community group. [Learn more about the nuances of
   * community:](https://support.whapi.cloud/help-desk/communities/introduction)
   *
   * @summary Join in community group
   * @throws FetchError<400, types.JoinInCommunityGroupResponse400> Wrong request parameters
   * @throws FetchError<401, types.JoinInCommunityGroupResponse401> Need channel authorization
   * @throws FetchError<500, types.JoinInCommunityGroupResponse500> Internal Error
   */
  joinInCommunityGroup(metadata: types.JoinInCommunityGroupMetadataParam): Promise<FetchResponse<200, types.JoinInCommunityGroupResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/{GroupID}/join', 'post', metadata);
  }

  /**
   * This method is responsible for creating a group in community. [Learn more about the
   * nuances of community:](https://support.whapi.cloud/help-desk/communities/introduction)
   *
   * @summary Create group in community
   * @throws FetchError<400, types.CreateGroupInCommunityResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateGroupInCommunityResponse401> Need channel authorization
   * @throws FetchError<404, types.CreateGroupInCommunityResponse404> Community not found
   * @throws FetchError<500, types.CreateGroupInCommunityResponse500> Internal Error
   */
  createGroupInCommunity(body: types.CreateGroupInCommunityBodyParam, metadata: types.CreateGroupInCommunityMetadataParam): Promise<FetchResponse<200, types.CreateGroupInCommunityResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/createGroup', 'post', body, metadata);
  }

  /**
   * This method is responsible for change a community settings.
   *
   * @summary Change community settings
   * @throws FetchError<400, types.ChangeCommunitySettingsResponse400> Wrong request parameters
   * @throws FetchError<401, types.ChangeCommunitySettingsResponse401> Need channel authorization for update group settings
   * @throws FetchError<403, types.ChangeCommunitySettingsResponse403> You do not have permissions for this action
   * @throws FetchError<404, types.ChangeCommunitySettingsResponse404> Specified community not found
   * @throws FetchError<500, types.ChangeCommunitySettingsResponse500> Internal Error
   */
  changeCommunitySettings(body: types.ChangeCommunitySettingsBodyParam, metadata: types.ChangeCommunitySettingsMetadataParam): Promise<FetchResponse<200, types.ChangeCommunitySettingsResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/settings', 'patch', body, metadata);
  }

  /**
   * This method is responsible for add participants community.
   *
   * @summary Add participants to community
   * @throws FetchError<400, types.AddCommunityParticipantResponse400> Wrong request parameters
   * @throws FetchError<401, types.AddCommunityParticipantResponse401> Need channel authorization
   * @throws FetchError<403, types.AddCommunityParticipantResponse403> Not permission
   * @throws FetchError<404, types.AddCommunityParticipantResponse404> Community not found
   * @throws FetchError<500, types.AddCommunityParticipantResponse500> Internal Error
   */
  addCommunityParticipant(body: types.AddCommunityParticipantBodyParam, metadata: types.AddCommunityParticipantMetadataParam): Promise<FetchResponse<200, types.AddCommunityParticipantResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/participants', 'post', body, metadata);
  }

  /**
   * This method is responsible for remove paricipants from community.
   *
   * @summary Remove participants from community
   * @throws FetchError<400, types.RemoveCommunityParticipantResponse400> Wrong request parameters
   * @throws FetchError<401, types.RemoveCommunityParticipantResponse401> Need channel authorization
   * @throws FetchError<403, types.RemoveCommunityParticipantResponse403> Not permission
   * @throws FetchError<404, types.RemoveCommunityParticipantResponse404> Community not found
   * @throws FetchError<500, types.RemoveCommunityParticipantResponse500> Internal Error
   */
  removeCommunityParticipant(body: types.RemoveCommunityParticipantBodyParam, metadata: types.RemoveCommunityParticipantMetadataParam): Promise<FetchResponse<200, types.RemoveCommunityParticipantResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/participants', 'delete', body, metadata);
  }

  /**
   * This method is responsible for promote participants to admin in community.
   *
   * @summary Promote participants to admin in community
   * @throws FetchError<400, types.PromoteCommunityParticipantResponse400> Wrong request parameters
   * @throws FetchError<401, types.PromoteCommunityParticipantResponse401> Need channel authorization
   * @throws FetchError<403, types.PromoteCommunityParticipantResponse403> Not permission
   * @throws FetchError<404, types.PromoteCommunityParticipantResponse404> Community not found
   * @throws FetchError<500, types.PromoteCommunityParticipantResponse500> Internal Error
   */
  promoteCommunityParticipant(body: types.PromoteCommunityParticipantBodyParam, metadata: types.PromoteCommunityParticipantMetadataParam): Promise<FetchResponse<200, types.PromoteCommunityParticipantResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/admins', 'patch', body, metadata);
  }

  /**
   * This method is responsible for demote participants to admin in community.
   *
   * @summary Demote participants to admin in community
   * @throws FetchError<400, types.DemoteCommunityParticipantResponse400> Wrong request parameters
   * @throws FetchError<401, types.DemoteCommunityParticipantResponse401> Need channel authorization
   * @throws FetchError<403, types.DemoteCommunityParticipantResponse403> Not permission
   * @throws FetchError<404, types.DemoteCommunityParticipantResponse404> Community not found
   * @throws FetchError<500, types.DemoteCommunityParticipantResponse500> Internal Error
   */
  demoteCommunityParticipant(body: types.DemoteCommunityParticipantBodyParam, metadata: types.DemoteCommunityParticipantMetadataParam): Promise<FetchResponse<200, types.DemoteCommunityParticipantResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/admins', 'delete', body, metadata);
  }

  /**
   * This method is responsible for get a community subgroups. [Learn more about the nuances
   * of community:](https://support.whapi.cloud/help-desk/communities/introduction)
   *
   * @summary Get community subgroups
   * @throws FetchError<400, types.GetCommunitySubGroupsResponse400> Wrong request parameters
   * @throws FetchError<401, types.GetCommunitySubGroupsResponse401> Need channel authorization to get info
   * @throws FetchError<404, types.GetCommunitySubGroupsResponse404> Community not found
   * @throws FetchError<500, types.GetCommunitySubGroupsResponse500> Internal Error
   */
  getCommunitySubGroups(metadata: types.GetCommunitySubGroupsMetadataParam): Promise<FetchResponse<200, types.GetCommunitySubGroupsResponse200>> {
    return this.core.fetch('/communities/{CommunityID}/subGroups', 'get', metadata);
  }

  /**
   * This method is responsible for creating a call event.
   *
   * @summary Create call event
   * @throws FetchError<400, types.CreateCallEventResponse400> Wrong request parameters
   * @throws FetchError<401, types.CreateCallEventResponse401> Need channel authorization for add community
   * @throws FetchError<500, types.CreateCallEventResponse500> Internal Error
   */
  createCallEvent(body: types.CreateCallEventBodyParam): Promise<FetchResponse<200, types.CreateCallEventResponse200>> {
    return this.core.fetch('/calls', 'post', body);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { AcceptGroupInviteBodyParam, AcceptGroupInviteResponse200, AcceptGroupInviteResponse400, AcceptGroupInviteResponse401, AcceptGroupInviteResponse404, AcceptGroupInviteResponse500, AcceptNewsletterAdminRequestMetadataParam, AcceptNewsletterAdminRequestResponse200, AcceptNewsletterAdminRequestResponse400, AcceptNewsletterAdminRequestResponse401, AcceptNewsletterAdminRequestResponse404, AcceptNewsletterAdminRequestResponse500, AddCommunityParticipantBodyParam, AddCommunityParticipantMetadataParam, AddCommunityParticipantResponse200, AddCommunityParticipantResponse400, AddCommunityParticipantResponse401, AddCommunityParticipantResponse403, AddCommunityParticipantResponse404, AddCommunityParticipantResponse500, AddGroupParticipantBodyParam, AddGroupParticipantMetadataParam, AddGroupParticipantResponse200, AddGroupParticipantResponse400, AddGroupParticipantResponse401, AddGroupParticipantResponse403, AddGroupParticipantResponse404, AddGroupParticipantResponse409, AddGroupParticipantResponse500, AddLabelAssociationMetadataParam, AddLabelAssociationResponse200, AddLabelAssociationResponse400, AddLabelAssociationResponse401, AddLabelAssociationResponse404, AddLabelAssociationResponse409, AddLabelAssociationResponse500, ApproveGroupApplicationsListBodyParam, ApproveGroupApplicationsListMetadataParam, ApproveGroupApplicationsListResponse200, ApproveGroupApplicationsListResponse400, ApproveGroupApplicationsListResponse404, ApproveGroupApplicationsListResponse500, ArchiveChatBodyParam, ArchiveChatMetadataParam, ArchiveChatResponse200, ArchiveChatResponse400, ArchiveChatResponse401, ArchiveChatResponse404, ArchiveChatResponse500, BlacklistAddMetadataParam, BlacklistAddResponse200, BlacklistAddResponse400, BlacklistAddResponse404, BlacklistAddResponse500, BlacklistRemoveMetadataParam, BlacklistRemoveResponse200, BlacklistRemoveResponse400, BlacklistRemoveResponse404, BlacklistRemoveResponse500, ChangeCommunitySettingsBodyParam, ChangeCommunitySettingsMetadataParam, ChangeCommunitySettingsResponse200, ChangeCommunitySettingsResponse400, ChangeCommunitySettingsResponse401, ChangeCommunitySettingsResponse403, ChangeCommunitySettingsResponse404, ChangeCommunitySettingsResponse500, CheckExistMetadataParam, CheckExistResponse200, CheckExistResponse400, CheckExistResponse402, CheckExistResponse404, CheckExistResponse500, CheckHealthMetadataParam, CheckHealthResponse200, CheckHealthResponse500, CheckPhonesBodyParam, CheckPhonesResponse200, CheckPhonesResponse400, CheckPhonesResponse401, CheckPhonesResponse402, CheckPhonesResponse429, CheckPhonesResponse500, CreateCallEventBodyParam, CreateCallEventResponse200, CreateCallEventResponse400, CreateCallEventResponse401, CreateCallEventResponse500, CreateCollectionBodyParam, CreateCollectionResponse200, CreateCollectionResponse400, CreateCollectionResponse401, CreateCollectionResponse429, CreateCollectionResponse500, CreateCommunityBodyParam, CreateCommunityResponse200, CreateCommunityResponse400, CreateCommunityResponse401, CreateCommunityResponse500, CreateGroupBodyParam, CreateGroupInCommunityBodyParam, CreateGroupInCommunityMetadataParam, CreateGroupInCommunityResponse200, CreateGroupInCommunityResponse400, CreateGroupInCommunityResponse401, CreateGroupInCommunityResponse404, CreateGroupInCommunityResponse500, CreateGroupResponse200, CreateGroupResponse400, CreateGroupResponse401, CreateGroupResponse404, CreateGroupResponse429, CreateGroupResponse500, CreateLabelBodyParam, CreateLabelResponse200, CreateLabelResponse400, CreateLabelResponse500, CreateNewsletterAdminInviteBodyParam, CreateNewsletterAdminInviteMetadataParam, CreateNewsletterAdminInviteResponse200, CreateNewsletterAdminInviteResponse400, CreateNewsletterAdminInviteResponse401, CreateNewsletterAdminInviteResponse404, CreateNewsletterAdminInviteResponse500, CreateNewsletterBodyParam, CreateNewsletterResponse200, CreateNewsletterResponse400, CreateNewsletterResponse401, CreateNewsletterResponse404, CreateNewsletterResponse429, CreateNewsletterResponse500, CreateProductBodyParam, CreateProductResponse200, CreateProductResponse400, CreateProductResponse401, CreateProductResponse429, CreateProductResponse500, CreateStoryAudioBodyParam, CreateStoryAudioResponse200, CreateStoryAudioResponse400, CreateStoryAudioResponse401, CreateStoryAudioResponse402, CreateStoryAudioResponse403, CreateStoryAudioResponse404, CreateStoryAudioResponse413, CreateStoryAudioResponse415, CreateStoryAudioResponse429, CreateStoryAudioResponse500, CreateStoryBodyParam, CreateStoryMediaBodyParam, CreateStoryMediaResponse200, CreateStoryMediaResponse400, CreateStoryMediaResponse401, CreateStoryMediaResponse402, CreateStoryMediaResponse403, CreateStoryMediaResponse404, CreateStoryMediaResponse413, CreateStoryMediaResponse415, CreateStoryMediaResponse429, CreateStoryMediaResponse500, CreateStoryResponse200, CreateStoryResponse400, CreateStoryResponse401, CreateStoryResponse402, CreateStoryResponse404, CreateStoryResponse413, CreateStoryResponse415, CreateStoryResponse429, CreateStoryResponse500, CreateStoryTextBodyParam, CreateStoryTextResponse200, CreateStoryTextResponse400, CreateStoryTextResponse401, CreateStoryTextResponse402, CreateStoryTextResponse403, CreateStoryTextResponse404, CreateStoryTextResponse413, CreateStoryTextResponse415, CreateStoryTextResponse429, CreateStoryTextResponse500, DeactivateCommunityMetadataParam, DeactivateCommunityResponse200, DeactivateCommunityResponse400, DeactivateCommunityResponse401, DeactivateCommunityResponse403, DeactivateCommunityResponse404, DeactivateCommunityResponse500, DeleteChatMetadataParam, DeleteChatResponse200, DeleteChatResponse400, DeleteChatResponse401, DeleteChatResponse404, DeleteChatResponse500, DeleteCollectionMetadataParam, DeleteCollectionResponse200, DeleteCollectionResponse400, DeleteCollectionResponse401, DeleteCollectionResponse429, DeleteCollectionResponse500, DeleteGroupIconMetadataParam, DeleteGroupIconResponse200, DeleteGroupIconResponse400, DeleteGroupIconResponse401, DeleteGroupIconResponse403, DeleteGroupIconResponse404, DeleteGroupIconResponse500, DeleteLabelAssociationMetadataParam, DeleteLabelAssociationResponse200, DeleteLabelAssociationResponse400, DeleteLabelAssociationResponse401, DeleteLabelAssociationResponse404, DeleteLabelAssociationResponse500, DeleteMediaMetadataParam, DeleteMediaResponse200, DeleteMediaResponse400, DeleteMediaResponse404, DeleteMediaResponse500, DeleteMessageMetadataParam, DeleteMessageResponse200, DeleteMessageResponse400, DeleteMessageResponse401, DeleteMessageResponse404, DeleteMessageResponse500, DeleteNewsletterMetadataParam, DeleteNewsletterResponse200, DeleteNewsletterResponse400, DeleteNewsletterResponse401, DeleteNewsletterResponse404, DeleteNewsletterResponse500, DeleteProductMetadataParam, DeleteProductResponse200, DeleteProductResponse400, DeleteProductResponse401, DeleteProductResponse404, DeleteProductResponse429, DeleteProductResponse500, DemoteCommunityParticipantBodyParam, DemoteCommunityParticipantMetadataParam, DemoteCommunityParticipantResponse200, DemoteCommunityParticipantResponse400, DemoteCommunityParticipantResponse401, DemoteCommunityParticipantResponse403, DemoteCommunityParticipantResponse404, DemoteCommunityParticipantResponse500, DemoteGroupAdminBodyParam, DemoteGroupAdminMetadataParam, DemoteGroupAdminResponse200, DemoteGroupAdminResponse400, DemoteGroupAdminResponse401, DemoteGroupAdminResponse403, DemoteGroupAdminResponse404, DemoteGroupAdminResponse500, DemoteNewsletterAdminMetadataParam, DemoteNewsletterAdminResponse200, DemoteNewsletterAdminResponse400, DemoteNewsletterAdminResponse401, DemoteNewsletterAdminResponse404, DemoteNewsletterAdminResponse500, EditBusinessProfileBodyParam, EditBusinessProfileResponse200, EditBusinessProfileResponse400, EditBusinessProfileResponse401, EditBusinessProfileResponse429, EditBusinessProfileResponse500, EditCollectionBodyParam, EditCollectionMetadataParam, EditCollectionResponse200, EditCollectionResponse400, EditCollectionResponse401, EditCollectionResponse429, EditCollectionResponse500, EditNewsletterBodyParam, EditNewsletterMetadataParam, EditNewsletterResponse200, EditNewsletterResponse400, EditNewsletterResponse401, EditNewsletterResponse404, EditNewsletterResponse429, EditNewsletterResponse500, FindNewsletterMetadataParam, FindNewsletterResponse200, FindNewsletterResponse400, FindNewsletterResponse404, FindNewsletterResponse500, ForwardMessageBodyParam, ForwardMessageMetadataParam, ForwardMessageResponse200, ForwardMessageResponse400, ForwardMessageResponse401, ForwardMessageResponse402, ForwardMessageResponse404, ForwardMessageResponse429, ForwardMessageResponse500, GetAllowedEventsResponse200, GetAllowedEventsResponse500, GetBusinessProfileResponse200, GetBusinessProfileResponse400, GetBusinessProfileResponse401, GetBusinessProfileResponse500, GetChannelSettingsBodyParam, GetChannelSettingsResponse200, GetChannelSettingsResponse500, GetChatMetadataParam, GetChatResponse200, GetChatResponse400, GetChatResponse404, GetChatResponse500, GetChatsMetadataParam, GetChatsResponse200, GetChatsResponse400, GetChatsResponse500, GetCollectionMetadataParam, GetCollectionResponse200, GetCollectionResponse400, GetCollectionResponse401, GetCollectionResponse429, GetCollectionResponse500, GetCollectionsListMetadataParam, GetCollectionsListResponse200, GetCollectionsListResponse400, GetCollectionsListResponse401, GetCollectionsListResponse429, GetCollectionsListResponse500, GetCommunitiesMetadataParam, GetCommunitiesResponse200, GetCommunitiesResponse400, GetCommunitiesResponse401, GetCommunitiesResponse500, GetCommunityMetadataParam, GetCommunityResponse200, GetCommunityResponse400, GetCommunityResponse401, GetCommunityResponse404, GetCommunityResponse500, GetCommunitySubGroupsMetadataParam, GetCommunitySubGroupsResponse200, GetCommunitySubGroupsResponse400, GetCommunitySubGroupsResponse401, GetCommunitySubGroupsResponse404, GetCommunitySubGroupsResponse500, GetContactMetadataParam, GetContactProductsMetadataParam, GetContactProductsResponse200, GetContactProductsResponse400, GetContactProductsResponse401, GetContactProductsResponse404, GetContactProductsResponse500, GetContactProfileMetadataParam, GetContactProfileResponse200, GetContactProfileResponse400, GetContactProfileResponse401, GetContactProfileResponse402, GetContactProfileResponse404, GetContactProfileResponse500, GetContactResponse200, GetContactResponse400, GetContactResponse404, GetContactResponse500, GetContactsMetadataParam, GetContactsResponse200, GetContactsResponse400, GetContactsResponse404, GetContactsResponse500, GetGroupApplicationsListMetadataParam, GetGroupApplicationsListResponse200, GetGroupApplicationsListResponse400, GetGroupApplicationsListResponse404, GetGroupApplicationsListResponse500, GetGroupIconMetadataParam, GetGroupIconResponse200, GetGroupIconResponse204, GetGroupIconResponse400, GetGroupIconResponse401, GetGroupIconResponse403, GetGroupIconResponse404, GetGroupIconResponse500, GetGroupInviteMetadataParam, GetGroupInviteResponse200, GetGroupInviteResponse400, GetGroupInviteResponse401, GetGroupInviteResponse403, GetGroupInviteResponse404, GetGroupInviteResponse500, GetGroupMetadataByInviteCodeMetadataParam, GetGroupMetadataByInviteCodeResponse200, GetGroupMetadataByInviteCodeResponse400, GetGroupMetadataByInviteCodeResponse401, GetGroupMetadataByInviteCodeResponse404, GetGroupMetadataByInviteCodeResponse429, GetGroupMetadataByInviteCodeResponse500, GetGroupMetadataParam, GetGroupResponse200, GetGroupResponse400, GetGroupResponse404, GetGroupResponse500, GetGroupsMetadataParam, GetGroupsResponse200, GetGroupsResponse400, GetGroupsResponse500, GetLabelAssociationsMetadataParam, GetLabelAssociationsResponse200, GetLabelAssociationsResponse400, GetLabelAssociationsResponse404, GetLabelAssociationsResponse500, GetLabelsResponse200, GetLabelsResponse400, GetLabelsResponse500, GetLimitsResponse200, GetLimitsResponse204, GetLimitsResponse500, GetMediaFilesMetadataParam, GetMediaFilesResponse200, GetMediaFilesResponse400, GetMediaFilesResponse500, GetMediaMetadataParam, GetMediaResponse200, GetMediaResponse400, GetMediaResponse404, GetMediaResponse500, GetMessageMetadataParam, GetMessageResponse200, GetMessageResponse400, GetMessageResponse404, GetMessageResponse500, GetMessageViewStatusesMetadataParam, GetMessageViewStatusesResponse200, GetMessageViewStatusesResponse400, GetMessageViewStatusesResponse403, GetMessageViewStatusesResponse404, GetMessageViewStatusesResponse500, GetMessagesByChatIdMetadataParam, GetMessagesByChatIdResponse200, GetMessagesByChatIdResponse400, GetMessagesByChatIdResponse404, GetMessagesByChatIdResponse500, GetMessagesMetadataParam, GetMessagesNewsletterMetadataParam, GetMessagesNewsletterResponse200, GetMessagesNewsletterResponse400, GetMessagesNewsletterResponse404, GetMessagesNewsletterResponse500, GetMessagesResponse200, GetMessagesResponse400, GetMessagesResponse500, GetNewsletterByInviteCodeMetadataParam, GetNewsletterByInviteCodeResponse200, GetNewsletterByInviteCodeResponse400, GetNewsletterByInviteCodeResponse401, GetNewsletterByInviteCodeResponse404, GetNewsletterByInviteCodeResponse429, GetNewsletterByInviteCodeResponse500, GetNewsletterMetadataParam, GetNewsletterResponse200, GetNewsletterResponse400, GetNewsletterResponse404, GetNewsletterResponse500, GetNewslettersMetadataParam, GetNewslettersResponse200, GetNewslettersResponse400, GetNewslettersResponse500, GetOrderItemsMetadataParam, GetOrderItemsResponse200, GetOrderItemsResponse401, GetOrderItemsResponse403, GetOrderItemsResponse404, GetOrderItemsResponse500, GetPresenceMetadataParam, GetPresenceResponse200, GetPresenceResponse400, GetPresenceResponse401, GetPresenceResponse404, GetPresenceResponse500, GetProductMetadataParam, GetProductResponse200, GetProductResponse400, GetProductResponse401, GetProductResponse404, GetProductResponse500, GetProductsMetadataParam, GetProductsResponse200, GetProductsResponse400, GetProductsResponse401, GetProductsResponse429, GetProductsResponse500, GetStoriesMetadataParam, GetStoriesResponse200, GetStoriesResponse400, GetStoriesResponse500, GetUserProfileResponse200, GetUserProfileResponse500, JoinInCommunityGroupMetadataParam, JoinInCommunityGroupResponse200, JoinInCommunityGroupResponse400, JoinInCommunityGroupResponse401, JoinInCommunityGroupResponse500, LeaveGroupMetadataParam, LeaveGroupResponse200, LeaveGroupResponse400, LeaveGroupResponse401, LeaveGroupResponse404, LeaveGroupResponse500, LinkGroupToCommunityMetadataParam, LinkGroupToCommunityResponse200, LinkGroupToCommunityResponse400, LinkGroupToCommunityResponse401, LinkGroupToCommunityResponse403, LinkGroupToCommunityResponse404, LinkGroupToCommunityResponse500, LoginUserImageMetadataParam, LoginUserImageResponse200, LoginUserImageResponse500, LoginUserMetadataParam, LoginUserResponse200, LoginUserResponse406, LoginUserResponse409, LoginUserResponse422, LoginUserResponse500, LoginUserRowDataMetadataParam, LoginUserRowDataResponse200, LoginUserRowDataResponse406, LoginUserRowDataResponse409, LoginUserRowDataResponse500, LoginUserViaAuthCodeMetadataParam, LoginUserViaAuthCodeResponse200, LoginUserViaAuthCodeResponse400, LoginUserViaAuthCodeResponse406, LoginUserViaAuthCodeResponse409, LoginUserViaAuthCodeResponse422, LoginUserViaAuthCodeResponse500, LoginUserViaMobileBodyParam, LoginUserViaMobileResponse200, LoginUserViaMobileResponse400, LoginUserViaMobileResponse403, LoginUserViaMobileResponse406, LoginUserViaMobileResponse409, LoginUserViaMobileResponse412, LoginUserViaMobileResponse422, LoginUserViaMobileResponse500, LogoutUserResponse200, LogoutUserResponse409, LogoutUserResponse500, MarkMessageAsReadMetadataParam, MarkMessageAsReadResponse200, MarkMessageAsReadResponse400, MarkMessageAsReadResponse401, MarkMessageAsReadResponse404, MarkMessageAsReadResponse500, PatchChatBodyParam, PatchChatMetadataParam, PatchChatResponse200, PatchChatResponse400, PatchChatResponse401, PatchChatResponse404, PatchChatResponse500, PinMessageBodyParam, PinMessageMetadataParam, PinMessageResponse200, PinMessageResponse400, PinMessageResponse401, PinMessageResponse404, PinMessageResponse500, PromoteCommunityParticipantBodyParam, PromoteCommunityParticipantMetadataParam, PromoteCommunityParticipantResponse200, PromoteCommunityParticipantResponse400, PromoteCommunityParticipantResponse401, PromoteCommunityParticipantResponse403, PromoteCommunityParticipantResponse404, PromoteCommunityParticipantResponse500, PromoteToGroupAdminBodyParam, PromoteToGroupAdminMetadataParam, PromoteToGroupAdminResponse200, PromoteToGroupAdminResponse400, PromoteToGroupAdminResponse401, PromoteToGroupAdminResponse403, PromoteToGroupAdminResponse404, PromoteToGroupAdminResponse500, ReactToMessageBodyParam, ReactToMessageMetadataParam, ReactToMessageResponse200, ReactToMessageResponse400, ReactToMessageResponse401, ReactToMessageResponse402, ReactToMessageResponse404, ReactToMessageResponse500, RecommendedNewsletterMetadataParam, RecommendedNewsletterResponse200, RecommendedNewsletterResponse400, RecommendedNewsletterResponse404, RecommendedNewsletterResponse500, RejectGroupApplicationsListBodyParam, RejectGroupApplicationsListMetadataParam, RejectGroupApplicationsListResponse200, RejectGroupApplicationsListResponse400, RejectGroupApplicationsListResponse404, RejectGroupApplicationsListResponse500, RemoveCommunityParticipantBodyParam, RemoveCommunityParticipantMetadataParam, RemoveCommunityParticipantResponse200, RemoveCommunityParticipantResponse400, RemoveCommunityParticipantResponse401, RemoveCommunityParticipantResponse403, RemoveCommunityParticipantResponse404, RemoveCommunityParticipantResponse500, RemoveGroupParticipantBodyParam, RemoveGroupParticipantMetadataParam, RemoveGroupParticipantResponse200, RemoveGroupParticipantResponse400, RemoveGroupParticipantResponse401, RemoveGroupParticipantResponse403, RemoveGroupParticipantResponse404, RemoveGroupParticipantResponse500, ResetChannelSettingsResponse200, ResetChannelSettingsResponse409, ResetChannelSettingsResponse500, RevokeCommunityInviteMetadataParam, RevokeCommunityInviteResponse200, RevokeCommunityInviteResponse400, RevokeCommunityInviteResponse401, RevokeCommunityInviteResponse404, RevokeCommunityInviteResponse500, RevokeGroupInviteMetadataParam, RevokeGroupInviteResponse200, RevokeGroupInviteResponse400, RevokeGroupInviteResponse401, RevokeGroupInviteResponse404, RevokeGroupInviteResponse500, RevokeNewsletterAdminInviteMetadataParam, RevokeNewsletterAdminInviteResponse200, RevokeNewsletterAdminInviteResponse400, RevokeNewsletterAdminInviteResponse401, RevokeNewsletterAdminInviteResponse404, RevokeNewsletterAdminInviteResponse500, SendCatalogBodyParam, SendCatalogMetadataParam, SendCatalogResponse200, SendCatalogResponse400, SendCatalogResponse401, SendCatalogResponse404, SendCatalogResponse429, SendCatalogResponse500, SendContactBodyParam, SendContactMetadataParam, SendContactResponse200, SendContactResponse400, SendContactResponse401, SendContactResponse404, SendContactResponse429, SendContactResponse500, SendGroupInviteBodyParam, SendGroupInviteMetadataParam, SendGroupInviteResponse200, SendGroupInviteResponse400, SendGroupInviteResponse401, SendGroupInviteResponse402, SendGroupInviteResponse404, SendGroupInviteResponse429, SendGroupInviteResponse500, SendMePresenceBodyParam, SendMePresenceResponse200, SendMePresenceResponse400, SendMePresenceResponse401, SendMePresenceResponse404, SendMePresenceResponse500, SendMediaMessageBodyParam, SendMediaMessageMetadataParam, SendMediaMessageResponse200, SendMediaMessageResponse400, SendMediaMessageResponse401, SendMediaMessageResponse402, SendMediaMessageResponse404, SendMediaMessageResponse413, SendMediaMessageResponse415, SendMediaMessageResponse429, SendMediaMessageResponse500, SendMessageAudioBodyParam, SendMessageAudioResponse200, SendMessageAudioResponse400, SendMessageAudioResponse401, SendMessageAudioResponse402, SendMessageAudioResponse403, SendMessageAudioResponse404, SendMessageAudioResponse413, SendMessageAudioResponse415, SendMessageAudioResponse429, SendMessageAudioResponse500, SendMessageContactBodyParam, SendMessageContactListBodyParam, SendMessageContactListResponse200, SendMessageContactListResponse400, SendMessageContactListResponse401, SendMessageContactListResponse402, SendMessageContactListResponse403, SendMessageContactListResponse413, SendMessageContactListResponse429, SendMessageContactListResponse500, SendMessageContactResponse200, SendMessageContactResponse400, SendMessageContactResponse401, SendMessageContactResponse402, SendMessageContactResponse403, SendMessageContactResponse413, SendMessageContactResponse429, SendMessageContactResponse500, SendMessageDocumentBodyParam, SendMessageDocumentResponse200, SendMessageDocumentResponse400, SendMessageDocumentResponse401, SendMessageDocumentResponse402, SendMessageDocumentResponse403, SendMessageDocumentResponse404, SendMessageDocumentResponse413, SendMessageDocumentResponse415, SendMessageDocumentResponse429, SendMessageDocumentResponse500, SendMessageGifBodyParam, SendMessageGifResponse200, SendMessageGifResponse400, SendMessageGifResponse401, SendMessageGifResponse402, SendMessageGifResponse403, SendMessageGifResponse404, SendMessageGifResponse413, SendMessageGifResponse415, SendMessageGifResponse429, SendMessageGifResponse500, SendMessageImageBodyParam, SendMessageImageResponse200, SendMessageImageResponse400, SendMessageImageResponse401, SendMessageImageResponse402, SendMessageImageResponse403, SendMessageImageResponse404, SendMessageImageResponse413, SendMessageImageResponse415, SendMessageImageResponse429, SendMessageImageResponse500, SendMessageInteractiveBodyParam, SendMessageInteractiveResponse200, SendMessageInteractiveResponse400, SendMessageInteractiveResponse401, SendMessageInteractiveResponse402, SendMessageInteractiveResponse403, SendMessageInteractiveResponse404, SendMessageInteractiveResponse413, SendMessageInteractiveResponse415, SendMessageInteractiveResponse429, SendMessageInteractiveResponse500, SendMessageLinkPreviewBodyParam, SendMessageLinkPreviewResponse200, SendMessageLinkPreviewResponse400, SendMessageLinkPreviewResponse401, SendMessageLinkPreviewResponse402, SendMessageLinkPreviewResponse403, SendMessageLinkPreviewResponse404, SendMessageLinkPreviewResponse413, SendMessageLinkPreviewResponse415, SendMessageLinkPreviewResponse429, SendMessageLinkPreviewResponse500, SendMessageLiveLocationBodyParam, SendMessageLiveLocationResponse200, SendMessageLiveLocationResponse400, SendMessageLiveLocationResponse401, SendMessageLiveLocationResponse402, SendMessageLiveLocationResponse403, SendMessageLiveLocationResponse413, SendMessageLiveLocationResponse429, SendMessageLiveLocationResponse500, SendMessageLocationBodyParam, SendMessageLocationResponse200, SendMessageLocationResponse400, SendMessageLocationResponse401, SendMessageLocationResponse402, SendMessageLocationResponse403, SendMessageLocationResponse413, SendMessageLocationResponse429, SendMessageLocationResponse500, SendMessagePollBodyParam, SendMessagePollResponse200, SendMessagePollResponse400, SendMessagePollResponse401, SendMessagePollResponse402, SendMessagePollResponse403, SendMessagePollResponse429, SendMessagePollResponse500, SendMessageShortBodyParam, SendMessageShortResponse200, SendMessageShortResponse400, SendMessageShortResponse401, SendMessageShortResponse402, SendMessageShortResponse403, SendMessageShortResponse404, SendMessageShortResponse413, SendMessageShortResponse415, SendMessageShortResponse429, SendMessageShortResponse500, SendMessageStickerBodyParam, SendMessageStickerResponse200, SendMessageStickerResponse400, SendMessageStickerResponse401, SendMessageStickerResponse402, SendMessageStickerResponse403, SendMessageStickerResponse404, SendMessageStickerResponse413, SendMessageStickerResponse415, SendMessageStickerResponse429, SendMessageStickerResponse500, SendMessageStoryAudioBodyParam, SendMessageStoryAudioResponse200, SendMessageStoryAudioResponse400, SendMessageStoryAudioResponse401, SendMessageStoryAudioResponse402, SendMessageStoryAudioResponse403, SendMessageStoryAudioResponse404, SendMessageStoryAudioResponse413, SendMessageStoryAudioResponse415, SendMessageStoryAudioResponse429, SendMessageStoryAudioResponse500, SendMessageStoryBodyParam, SendMessageStoryMediaBodyParam, SendMessageStoryMediaResponse200, SendMessageStoryMediaResponse400, SendMessageStoryMediaResponse401, SendMessageStoryMediaResponse402, SendMessageStoryMediaResponse403, SendMessageStoryMediaResponse404, SendMessageStoryMediaResponse413, SendMessageStoryMediaResponse415, SendMessageStoryMediaResponse429, SendMessageStoryMediaResponse500, SendMessageStoryResponse200, SendMessageStoryResponse400, SendMessageStoryResponse401, SendMessageStoryResponse402, SendMessageStoryResponse403, SendMessageStoryResponse404, SendMessageStoryResponse413, SendMessageStoryResponse415, SendMessageStoryResponse429, SendMessageStoryResponse500, SendMessageStoryTextBodyParam, SendMessageStoryTextResponse200, SendMessageStoryTextResponse400, SendMessageStoryTextResponse401, SendMessageStoryTextResponse402, SendMessageStoryTextResponse403, SendMessageStoryTextResponse404, SendMessageStoryTextResponse413, SendMessageStoryTextResponse415, SendMessageStoryTextResponse429, SendMessageStoryTextResponse500, SendMessageTextBodyParam, SendMessageTextResponse200, SendMessageTextResponse400, SendMessageTextResponse401, SendMessageTextResponse402, SendMessageTextResponse403, SendMessageTextResponse413, SendMessageTextResponse429, SendMessageTextResponse500, SendMessageVideoBodyParam, SendMessageVideoResponse200, SendMessageVideoResponse400, SendMessageVideoResponse401, SendMessageVideoResponse402, SendMessageVideoResponse403, SendMessageVideoResponse404, SendMessageVideoResponse413, SendMessageVideoResponse415, SendMessageVideoResponse429, SendMessageVideoResponse500, SendMessageVoiceBodyParam, SendMessageVoiceResponse200, SendMessageVoiceResponse400, SendMessageVoiceResponse401, SendMessageVoiceResponse402, SendMessageVoiceResponse403, SendMessageVoiceResponse404, SendMessageVoiceResponse413, SendMessageVoiceResponse415, SendMessageVoiceResponse429, SendMessageVoiceResponse500, SendNewsletterInviteBodyParam, SendNewsletterInviteMetadataParam, SendNewsletterInviteResponse200, SendNewsletterInviteResponse400, SendNewsletterInviteResponse401, SendNewsletterInviteResponse404, SendNewsletterInviteResponse429, SendNewsletterInviteResponse500, SendPresenceBodyParam, SendPresenceMetadataParam, SendPresenceResponse200, SendPresenceResponse400, SendPresenceResponse401, SendPresenceResponse404, SendPresenceResponse500, SendProductBodyParam, SendProductMetadataParam, SendProductResponse200, SendProductResponse400, SendProductResponse401, SendProductResponse404, SendProductResponse429, SendProductResponse500, SetGroupIconBodyParam, SetGroupIconMetadataParam, SetGroupIconResponse200, SetGroupIconResponse400, SetGroupIconResponse401, SetGroupIconResponse403, SetGroupIconResponse404, SetGroupIconResponse500, StarMessageBodyParam, StarMessageMetadataParam, StarMessageResponse200, StarMessageResponse400, StarMessageResponse401, StarMessageResponse404, StarMessageResponse500, SubscribeNewsletterInviteMetadataParam, SubscribeNewsletterInviteResponse200, SubscribeNewsletterInviteResponse400, SubscribeNewsletterInviteResponse404, SubscribeNewsletterInviteResponse500, SubscribeNewsletterMetadataParam, SubscribeNewsletterResponse200, SubscribeNewsletterResponse400, SubscribeNewsletterResponse404, SubscribeNewsletterResponse500, SubscribePresenceMetadataParam, SubscribePresenceResponse200, SubscribePresenceResponse400, SubscribePresenceResponse401, SubscribePresenceResponse402, SubscribePresenceResponse404, SubscribePresenceResponse409, SubscribePresenceResponse500, TrackingNewsletterMetadataParam, TrackingNewsletterResponse200, TrackingNewsletterResponse400, TrackingNewsletterResponse404, TrackingNewsletterResponse500, UnlinkGroupFromCommunityMetadataParam, UnlinkGroupFromCommunityResponse200, UnlinkGroupFromCommunityResponse400, UnlinkGroupFromCommunityResponse401, UnlinkGroupFromCommunityResponse403, UnlinkGroupFromCommunityResponse404, UnlinkGroupFromCommunityResponse500, UnpinMessageMetadataParam, UnpinMessageResponse200, UnpinMessageResponse400, UnpinMessageResponse401, UnpinMessageResponse404, UnpinMessageResponse500, UnsubscribeNewsletterInviteMetadataParam, UnsubscribeNewsletterInviteResponse200, UnsubscribeNewsletterInviteResponse400, UnsubscribeNewsletterInviteResponse404, UnsubscribeNewsletterInviteResponse500, UnsubscribeNewsletterMetadataParam, UnsubscribeNewsletterResponse200, UnsubscribeNewsletterResponse400, UnsubscribeNewsletterResponse404, UnsubscribeNewsletterResponse500, UpdateChannelSettingsBodyParam, UpdateChannelSettingsResponse200, UpdateChannelSettingsResponse400, UpdateChannelSettingsResponse500, UpdateGroupInfoBodyParam, UpdateGroupInfoMetadataParam, UpdateGroupInfoResponse200, UpdateGroupInfoResponse400, UpdateGroupInfoResponse401, UpdateGroupInfoResponse403, UpdateGroupInfoResponse404, UpdateGroupInfoResponse500, UpdateGroupSettingBodyParam, UpdateGroupSettingMetadataParam, UpdateGroupSettingResponse200, UpdateGroupSettingResponse400, UpdateGroupSettingResponse401, UpdateGroupSettingResponse403, UpdateGroupSettingResponse404, UpdateGroupSettingResponse500, UpdateProductBodyParam, UpdateProductMetadataParam, UpdateProductResponse200, UpdateProductResponse400, UpdateProductResponse401, UpdateProductResponse404, UpdateProductResponse429, UpdateProductResponse500, UpdateUserProfileBodyParam, UpdateUserProfileResponse200, UpdateUserProfileResponse500, UploadMediaBodyParam, UploadMediaResponse200, UploadMediaResponse400, UploadMediaResponse401, UploadMediaResponse500, WebhookTestBodyParam, WebhookTestResponse200, WebhookTestResponse400, WebhookTestResponse500 } from './types';
