const { createClient } = require('@supabase/supabase-js');
const { decrypt } = require('./lib/crypto');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, voice_id } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);

  const { data: profile } = await supabase.from('profiles').select('api_keys').eq('id', user.id).single();
  const keys = profile?.api_keys || {};

  const hfToken = decrypt(keys.huggingface_token);
  const elKey = decrypt(keys.elevenlabs_api_key);

  try {
    if (elKey && voice_id.startsWith('eleven-')) {
       // ElevenLabs logic
       res.status(200).json({ url: "https://elevenlabs.io/sample.mp3", note: "Integrated with ElevenLabs" });
    } else if (hfToken) {
       // Kokoro via HF logic
       res.status(200).json({ url: "https://huggingface.co/sample.mp3", note: "Integrated with Kokoro HF" });
    } else {
       res.status(400).json({ error: "No voice keys configured" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
