import { DataTypes } from "sequelize";

const Token = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	creatorid: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	active: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	permissions: {
		type: DataTypes.JSON,
		defaultValue: ["*"],
	},
	createdat: {
		type: DataTypes.DATE,
	},
};

export default {
	name: "tokens",
	schema: Token,
};
