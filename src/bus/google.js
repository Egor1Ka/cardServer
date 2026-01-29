const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

const getRedirectUri = () => GOOGLE_REDIRECT_URI;

const buildAuthUrl = (state) => {
  const clientId = GOOGLE_CLIENT_ID;
  const redirectUri = getRedirectUri();

  if (!clientId || !redirectUri) {
    throw new Error("Google OAuth env is not configured");
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid email profile",
    state,
  }).toString();
  return url.toString();
};

const exchangeCode = async (code) => {
  const clientId = GOOGLE_CLIENT_ID;
  const clientSecret = GOOGLE_CLIENT_SECRET;
  const redirectUri = getRedirectUri();

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth env is not configured");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Google token exchange failed: ${details}`);
  }

  return await response.json();
};

const fetchUserInfo = async (accessToken) => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Google userinfo failed: ${details}`);
  }

  return await response.json();
};

const getProfile = async ({ access_token: accessToken }) => {
  if (!accessToken) {
    throw new Error("Google access_token is missing");
  }

  const userInfo = await fetchUserInfo(accessToken);
  return {
    sub: userInfo.sub,
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
  };
};

export default {
  buildAuthUrl,
  exchangeCode,
  fetchUserInfo,
  getProfile,
};
