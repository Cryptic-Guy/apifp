function decodeIdToken(idToken) {
  try {
    const payload = idToken.split('.')[1]; // JWT = header.payload.signature
    const decodedJson = Buffer.from(payload, 'base64url').toString('utf8'); // base64url safe decode
    const decoded = JSON.parse(decodedJson);

    const eoa = decoded.eoa || null;
    const futurepass = decoded.futurepass || null;
    const username = decoded.profile?.selectedProfile?.displayName || null;
    const profileId = decoded.profile?.selectedProfile?.profileId || null;

    return { eoa, futurepass, username, profileId };
  } catch (err) {
    console.error("❌ Error decoding ID token:", err);
    return null;
  }
}

module.exports = decodeIdToken;
