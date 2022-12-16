import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

async function refreshAccessToken(token) {
	console.log('Refreshed token is', refreshedToken);
	try {
		spotifyApi.setAccessToken(token.accessToken);
		spotifyApi.setRefreshToken(token.refreshToken);

		const { body: refreshedTokens } = await spotifyApi.refreshAccessToken();

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
		};
	} catch (error) {
		console.log(error);

		return {
			...token,
			error: 'RefreshAccessTokenError',
		};
	}
}

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		SpotifyProvider({
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
			authorization: LOGIN_URL,
		}),
		// ...add more providers here
	],
	secret: process.env.JWT_SECRET,
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async jwt({ token, user, account }) {
			// Initial sign in
			if (account && user) {
				console.log(account, token);
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					// accessTokenExpires: Date.now() + account.expires_at * 1000,
					accessTokenExpires: Date.now() + account.expires_at * 1000,
					// accessTokenExpires: account.expires_at * 1000,
					user,
				};
			}
			// Return previous token if the access token has not expired yet
			if (Date.now() < token.accessTokenExpires) {
				console.log('Existing access token is valid...');
				return token;
			}

			console.log('Access token has expired, refresh...');
			// Access token has expired, try to update it
			return refreshAccessToken(token);
		},

		async session({ session, token }) {
			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.username = token.username;
			return session;
		},
	},
};
export default NextAuth(authOptions);
