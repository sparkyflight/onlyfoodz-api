import firebase from "firebase-admin";
import serviceAccount from "../../firebaseService.js";
import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";

const firebaseService = firebase.initializeApp({
	credential: firebase.credential.cert(
		serviceAccount as firebase.ServiceAccount
	),
});

export default {
    method: "GET",
    url: "users/@me",
    schema: {
        querystring: {
            type: "object",
            properties: {
                token: { type: "string" },
            },
            required: ["token"],
        },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const { token }: any = request.params;

        const p: DecodedIdToken = await firebaseService
			.auth()
			.verifyIdToken(token, true);
		const user: User = await database.Users.get({ userid: p.uid });

		if (user) return reply.send(user);
		else
			return reply.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: token,
				error: true,
			});
    }
}