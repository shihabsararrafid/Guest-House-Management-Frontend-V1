export interface ResponseRoom {
	id: string;
	roomNumber: string;
	roomName: string | null;
	type: string;
	status: string;
	floor: number;
	capacity: number;
	pricePerNight: number;
	description: string;
	hasWifi: boolean;
	hasAC: boolean;
	hasTv: boolean;
	hasRefrigerator: boolean;
	squareFootage: number;
	viewType: string;
	isAvailable: boolean;
}
