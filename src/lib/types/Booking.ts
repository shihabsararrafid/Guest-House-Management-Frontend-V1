// src/lib/types/booking.ts

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type PaymentType = 'PAYMENT' | 'REFUND';
export type DiscountType = 'Amount' | 'Percentage';

export interface Room {
	roomNumber: string;
}

export interface BookingRoom {
	bookingId: string;
	roomId: string;
	pricePerNight: number;
	numberOfGuests: number;
	specialRequests: string | null;
	createdAt: string;
	room: Room;
}

export interface Transaction {
	id: string;
	amount: number;
	currency: string;
	status: TransactionStatus;
	type: PaymentType;
	description: string | null;
	metadata: unknown | null;
	stripePaymentIntentId: string;
	stripeCustomerId: string;
	stripePaymentMethodId: string | null;
	stripeFees: number | null;
	stripeReceiptUrl: string | null;
	last4: string | null;
	paymentMethod: string | null;
	cardBrand: string | null;
	errorMessage: string | null;
	createdAt: string;
	updatedAt: string;
	userId: string;
	bookingId: string;
}

export interface Booking {
	id: string;
	guestId: string;
	checkIn: string;
	checkOut: string;
	totalPrice: number;
	totalPriceWithDiscount: number;
	discount: number;
	discountType: DiscountType;
	status: BookingStatus;
	isPaid: boolean;
	paymentDate: string | null;
	paidAmount: number;
	bookedMoney: number;
	createdAt: string;
	updatedAt: string;
	rooms: BookingRoom[];
	transaction: Transaction[];
}

export interface BookingsResponse {
	message: string;
	data: Booking[];
}
