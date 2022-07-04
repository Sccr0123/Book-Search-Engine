const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolver = {
	Query: {
		me: async (parent, args, context) => {
			const userData = await User.findOne({ _id: context.user._id })
				.select("-__v -password")
				.populate("savedBooks");

			return userData;
		},
		users: async () => {
			const users = User.find().sort({ createdAt: -1 });
			return users;
		},
		user: async (parent, { _id }) => {
			const user = User.findOne({ _id });
			return user;
		},
	},
	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError("Incorrect credentials");
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError("Incorrect credentials");
			}

			const token = signToken(user);

			return { token, user };
		},
        saveBook: async (parent, args, context) => {
			if (context.user) {
				//   const savedBook = await Book.create({ ...args, username: context.user.username });

				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { savedBooks: args.input } },
					{ new: true }
				);

				return updatedUser;
			}

			throw new AuthenticationError("You need to be logged in!");
		},
		removeBook: async (parent, args, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId: args.bookId } } },
					{ new: true }
				);

				return updatedUser;
			}

			throw new AuthenticationError("You need to be logged in!");
		},
	},
};

module.exports = resolver;
