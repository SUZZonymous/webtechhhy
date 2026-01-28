// api/verify.js – Dummy Telegram webhook handler (just acknowledges POST)
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Optional: log the update body for your own debugging (appears in Vercel logs)
    console.log('Telegram webhook received:', req.body);
    res.status(200).json({ ok: true }); // Quick 200 OK response – Telegram requires this
  } else {
    res.status(405).end('Method Not Allowed');
  }
}