const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const decodeIdToken = require('./decodeIdToken');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/exchange-token', async (req, res) => {
  const { code, codeVerifier } = req.body;

  if (!code || !codeVerifier) {
    return res.status(400).json({ error: 'Missing code or codeVerifier' });
  }

  const clientId = 'zW3rifmjGAZ2VZitnQoTq';
  const redirectUri = 'http://6853cf86deae92273fc4ce67--tubular-sherbet-859cc3.netlify.app';
  const tokenEndpoint = 'https://login.passonline.dev/token';

  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  try {
    console.log('📤 Sending token request...');
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody.toString(),
    });

    const tokenData = await response.json();
    console.log('📥 Received response:', tokenData);

    if (!response.ok) {
      return res.status(400).json({ error: 'Token exchange failed', details: tokenData });
    }

    const decoded = decodeIdToken(tokenData.id_token);
    console.log("🔍 Decoded token payload:", decoded);

    if (!decoded) {
      return res.status(500).json({ error: 'Failed to decode ID token' });
    }

    const { eoa, futurepass, username, profileId } = decoded;

    // ✅ Return clean strings for GDevelop
    return res.json({
      eoa: String(eoa || ''),
      futurepass: String(futurepass || ''),
      username: String(username || ''),
      profileId: String(profileId || '')
    });

  } catch (err) {
    console.error('💥 Server error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
