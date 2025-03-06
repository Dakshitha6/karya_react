export const okta = {
	issuer: import.meta.env.VITE_OKTA_ISSUER,
	clientId: import.meta.env.VITE_CLIENT_ID,
	redirectUri: "/login/callback",
	pkce: import.meta.env.VITE_PKCE,
};