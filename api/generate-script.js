const { createClient } = require('@supabase/supabase-js');
const { decrypt } = require('./lib/crypto');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const { context, video_type } = req.body;
  const token = authHeader.replace('Bearer ', '');

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  const { data: profile } = await supabase.from('profiles').select('api_keys').eq('id', user.id).single();
  const keys = profile?.api_keys || {};

  const geminiKey = decrypt(keys.gemini_api_key);
  const groqKey = decrypt(keys.groq_api_key);

  let script = "";

  try {
    if (geminiKey) {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a video script writer. Based on this research context: ${context}, write a ${video_type} video script. For Reel: punchy, hook in first 3 seconds, 150 words max. For Long Form: structured with intro, 3 main points, and CTA, 800–1200 words.`;
      const result = await model.generateContent(prompt);
      script = result.response.text();
    } else if (groqKey) {
      // Fallback to Groq via fetch
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "system", content: "You are a professional video script writer." }, { role: "user", content: context }]
        })
      });
      const data = await response.json();
      script = data.choices[0].message.content;
    } else {
      return res.status(400).json({ error: 'No AI keys configured in Settings' });
    }

    res.status(200).json({ script });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
