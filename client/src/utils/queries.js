import { gql } from "@apollo/client";

export const QUERY_ME_BASIC = gql`
	query me {
		me {
			_id
			username
			email
		}
	}
`;

export const QUERY_ME = gql`
	query me {
		me {
			_id
			username
			email
			savedBooks {
				authors
				description
				bookId
				image
				link
				title
			}
		}
	}
`;

export const getUsers = gql`
	query getUsers {
		users {
			_id
			username
			email
		}
	}
`;

export const getUser = gql`
	query getUser {
		user {
			_id
			username
			email
		}
	}
`;
