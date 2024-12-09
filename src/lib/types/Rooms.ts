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
// types/room.ts

export enum RoomType {
	SINGLE = 'SINGLE',
	DOUBLE = 'DOUBLE',
	TWIN = 'TWIN',
	SUITE = 'SUITE',
	DELUXE = 'DELUXE',
	PRESIDENTIAL = 'PRESIDENTIAL'
  }
  
  export enum RoomStatus {
	AVAILABLE = 'AVAILABLE',
	OCCUPIED = 'OCCUPIED',
	MAINTENANCE = 'MAINTENANCE',
	RESERVED = 'RESERVED',
	CLEANING = 'CLEANING'
  }
  
  export enum BedType {
	SINGLE = 'SINGLE',
	DOUBLE = 'DOUBLE',
	QUEEN = 'QUEEN',
	KING = 'KING',
	TWIN = 'TWIN'
  }
  
  export interface Bed {
	bedType: BedType;
	quantity: number;
	capacity: number;
  }
  
  export interface Room {
	id: string;
	roomNumber: string;
	roomName: string;
	type: RoomType;
	status: RoomStatus;
	floor: number;
	capacity: number;
	pricePerNight: number;
	hasWifi: boolean;
	hasAC: boolean;
	hasTv: boolean;
	hasRefrigerator: boolean;
	description: string;
	beds: Bed[];
	viewType: string;
	squareFootage: number;
  }
  
  export type NewRoom = Omit<Room, 'id'>;