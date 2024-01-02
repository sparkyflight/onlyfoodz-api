import * as database from "./database/handler.js";
import firebase from "firebase-admin";
import { Token, User } from "./database/types.interface.js";
import { DecodedIdToken } from "firebase-admin/auth";

const getAuth = async (token: string): Promise<User | null> => {
	let firebaseAuth: DecodedIdToken;
	let apiToken: Token | null;

	if (token === "" || token === null || token === undefined)
		throw new Error(
			"A token was not passed with this request, in the `Authorization` header. Please provide a valid token in the `Authorization` header."
		);
	else {
		try {
			firebaseAuth = await firebase.auth().verifyIdToken(token, true);
		} catch (error) {
			apiToken = await database.Tokens.get(token);
		}

		const getUser = async (user_id: string): Promise<User | null> => {
			return database.Users.get({ userid: user_id });
		};

		if (firebaseAuth) return getUser(firebaseAuth.uid) || null;
		else if (apiToken && "creatorid" in apiToken)
			return getUser(apiToken.creatorid) || null;
		else return null;
	}
};

export { getAuth };
