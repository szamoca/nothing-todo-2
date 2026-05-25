/**
 * Geographic coordinates used in user and company addresses.
 */
export interface Coordinates {
	lat: number;
	lng: number;
}

/**
 * Postal address information for a user or company.
 */
export interface Address {
	address: string;
	city: string;
	state: string;
	stateCode: string;
	postalCode: string;
	coordinates: Coordinates;
	country: string;
}

/**
 * Hair profile information returned by the DummyJSON users API.
 */
export interface Hair {
	color: string;
	type: string;
}

/**
 * Banking details associated with a user profile.
 */
export interface Bank {
	cardExpire: string;
	cardNumber: string;
	cardType: string;
	currency: string;
	iban: string;
}

/**
 * Cryptocurrency wallet information associated with a user profile.
 */
export interface Crypto {
	coin: string;
	wallet: string;
	network: string;
}

/**
 * Company details associated with a user profile.
 */
export interface Company {
	department: string;
	name: string;
	title: string;
	address: Address;
}

/**
 * Full user object returned by the DummyJSON users and auth endpoints.
 */
export interface User {
	id: number;
	firstName: string;
	lastName: string;
	maidenName: string;
	age: number;
	gender: string;
	email: string;
	phone: string;
	username: string;
	password: string;
	birthDate: string;
	image: string;
	bloodGroup: string;
	height: number;
	weight: number;
	eyeColor: string;
	hair: Hair;
	ip: string;
	address: Address;
	macAddress: string;
	university: string;
	bank: Bank;
	company: Company;
	ein: string;
	ssn: string;
	userAgent: string;
	crypto: Crypto;
	role: string;
}

/**
 * Authentication response returned by POST /auth/login.
 */
export interface AuthResponse {
	id: number;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	gender: string;
	image: string;
	accessToken: string;
	refreshToken: string;
}
