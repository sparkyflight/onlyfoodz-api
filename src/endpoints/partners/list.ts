import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../v2-database/prisma.js";

export default {
	url: "/partners/list",
	method: "GET",
	schema: {
		summary: "Get All Partners",
		description: "Returns a list about all of our partners.",
		tags: ["partners"],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const partners = await database.Partners.getAllPartners();
		return reply.send(partners);
	},
};
