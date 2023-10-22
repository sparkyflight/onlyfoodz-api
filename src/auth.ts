// Packages
import Discord from "discord-oauth2";
import { randomUUID } from "crypto";
import fetch from "node-fetch";

// Initialize Discord OAuth2
const discordCLI = new Discord({
	clientId: process.env.DISCORD_CLIENT_ID,
	clientSecret: process.env.DISCORD_CLIENT_SECRET,
	redirectUri: "https://api.onlyfoodz.xyz/auth/discord/callback",
});

// Discord
class discord {
	// Get the Authorization URL
	static async getAuthURL(redirect: string): Promise<any> {
		const state = JSON.stringify({
			redirect: redirect,
		});

		const url = discordCLI.generateAuthUrl({
			scope: ["identify"],
			state: state,
			responseType: "code",
		});

		return url;
	}

	// Get the Access Token
	static async getAccessToken(code: string): Promise<any> {
		const token = await discordCLI
			.tokenRequest({
				code: code,
				scope: ["identify"],
				grantType: "authorization_code",
			})
			.catch((err: any) => {
				return {
					error: err,
				};
			});

		return token;
	}

	// Get the Refresh Token
	static async getRefreshToken(refreshToken: string): Promise<any> {
		const token = await discordCLI
			.tokenRequest({
				refreshToken: refreshToken,
				grantType: "refresh_token",
				scope: ["identify"],
			})
			.catch((err: any) => {
				return {
					error: err,
				};
			});

		return token;
	}

	// Revoke the Access Token
	static async revokeAccessToken(accessToken: string): Promise<any> {
		const credentials = Buffer.from(
			`${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`
		).toString("base64");

		discordCLI.revokeToken(accessToken, credentials).catch((err: any) => {
			return {
				error: err,
			};
		});

		return {
			success: true,
			message: "Access Token Revoked",
		};
	}

	// Get the User Info
	static async getUserInfo(accessToken: string): Promise<any> {
		const user = await discordCLI.getUser(accessToken).catch((err: any) => {
			return {
				error: err,
			};
		});

		return user;
	}
}

// Github
class github {
	static async getAuthURL(redirect: string) {
		const state = JSON.stringify({
			redirect,
			uuid: randomUUID(),
		});

		return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user&state=${state}`;
	}

	static async getAccessToken(code: string) {
		const body = JSON.stringify({
			client_id: process.env.GITHUB_CLIENT_ID,
			client_secret: process.env.GITHUB_CLIENT_SECRET,
			code: code,
			redirect_uri: "https://api.onlyfoodz.xyz/auth/github/callback",
		});

		const token = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				body: body,
				headers: {
					Accept: "application/json",
				},
			}
		).then((res) => res.json());

		return token;
	}

	static async getUserInfo(token: string) {
		const data = await fetch("https://api.github.com/user", {
			headers: {
				Accept: "application/vnd.github+json",
				Authorization: `Bearer ${token}`,
				"X-Github-Api-Version": "2022-11-28",
			},
		}).then((res) => res.json());

		return data;
	}
}

// Expose Classes
export { discord, github };
