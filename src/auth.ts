import * as database from "./database/handler.js";
import firebase from "firebase-admin";
import { Token, User } from "./database/types.interface.js";
import { DecodedIdToken } from "firebase-admin/auth";

const getAuth = async (token: string): Promise<User | null> => {
	const firebaseAuth: DecodedIdToken = await firebase
		.auth()
		.verifyIdToken(token, true);
	const apiToken: Token | null = await database.Tokens.get(
		token
	).then((i) => {
		if (i) return i;
		else return null;
	});

	const getUser = async (user_id: string): Promise<User | null> => {
		return await database.Users.get({ userid: user_id });
	};

	if (firebaseAuth) return (await getUser(firebaseAuth?.uid)) || null;
	else if (apiToken && "creatorid" in apiToken)
		return (await getUser(apiToken?.creatorid)) || null;
	else throw new Error("token doesn't exist"); // cum
};

export { getAuth };
