// types/dashboard.ts

// For individual stat items
interface DashboardStat {
	value: number;
	trend: string;
	color: string;
	bgColor: string;
	icon: 'Hotel' | 'Users' | 'Calendar' | 'CreditCard';
}

// For the entire stats object
interface DashboardStats {
	totalRooms: DashboardStat;
	activeGuests: DashboardStat;
	newBookings: DashboardStat;
	revenue: DashboardStat;
}

// Optional: If you want a type for the complete API response
export interface DashboardResponse {
	stats: DashboardStats;
	recentBookings: RecentBooking[]; // If you have booking data
}

// Optional: Type for recent bookings
interface RecentBooking {
	id: string;
	guestName: string;
	email: string;
	roomNumber: string;
	checkIn: Date | string;
	checkOut: Date | string;
	status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'ON_GOING' | 'COMPLETED';
	amount: number;
	paidAmount: number;
}
