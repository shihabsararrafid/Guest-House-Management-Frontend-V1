# Guest House Management System - Frontend

A comprehensive web application for university guest house booking and management, built with SvelteKit and Flowbite components.

![Guest House Management System](/static/ruet_guest_house.jpg)

## 🌟 Features

### For Guests & Users

- **Account Management**

  - User registration and login with email verification
  - Profile management with personal and contact details
  - Role-based access (Guests, Receptionist, Admin)

- **Room Booking**

  - Browse available rooms with detailed information and amenities
  - Search rooms by date range, capacity, and room type
  - Real-time availability checking
  - Online booking with secure payment processing
  - Booking history and status tracking
  - Receipt generation and download

- **Issue Reporting**

  - Report and track maintenance issues or problems during stay
  - View issue status and resolution progress

- **User Interface**
  - Responsive design for all device sizes
  - Intuitive navigation and user-friendly interface
  - Dark/light mode support

### For Administrators

- **Dashboard**

  - Overview statistics and charts
  - Recent bookings and activity tracking
  - Quick action shortcuts

- **Room Management**

  - Add, edit, and delete rooms
  - Set room details, capacity, pricing, and amenities
  - Room availability status control
  - Room type configuration

- **Booking Management**

  - View and manage all bookings
  - Filter bookings by status, date, guest, etc.
  - Manually create, modify or cancel bookings
  - Track payment status and process payments

- **User Management**

  - Manage user accounts and roles
  - View user details and booking history
  - Enable/disable user accounts

- **Issue Management**

  - Track and respond to reported issues
  - Assign priority levels
  - Update status (Open, In Progress, Closed)
  - Detailed issue reports

- **Payment Processing**
  - Secure online payments using Stripe
  - Payment tracking and receipt generation
  - Partial and full payment options
  - Payment status monitoring

## 💻 Technologies

- **Frontend**

  - [SvelteKit](https://kit.svelte.dev/) - Full-stack framework for building web applications
  - [Flowbite Svelte](https://flowbite-svelte.com/) - UI component library based on Tailwind CSS
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
  - [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icon set

- **Authentication**

  - JWT-based authentication
  - Cookie-based user session management
  - Email verification

- **Payment Processing**

  - [Stripe](https://stripe.com/) - Secure payment processing

- **Other Tools**
  - [date-fns](https://date-fns.org/) - Date manipulation library
  - [svelte-toast](https://www.npmjs.com/package/@zerodevx/svelte-toast) - Toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/shihabsararrafid/Guest-House-Management-Frontend.git
   cd Guest-House-Management-Frontend
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PUBLIC_API_URL=http://localhost:5000/api/v1
   PUBLIC_STRIPE_KEY=your_stripe_publishable_key
   ```

4. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## 📂 Project Structure

```
src/
  ├── app.css           # Global CSS
  ├── app.html          # HTML template
  ├── lib/              # Shared libraries
  │   ├── components/   # Reusable components
  │   ├── data/         # Static data files
  │   ├── functions/    # Utility functions
  │   ├── stores/       # Svelte stores
  │   └── types/        # TypeScript types
  └── routes/           # SvelteKit routes
      ├── admin/        # Admin panel routes
      ├── auth/         # Authentication routes
      ├── bookings/     # User bookings routes
      └── checkout/     # Payment checkout routes
```

## 🔐 Authentication Flow

1. User registers with email, password, and personal details
2. Email verification is sent to the provided email
3. Upon verification, the user can log in
4. JWT tokens are stored in cookies for authentication
5. Different roles (USER, ADMIN, RECEPTIONIST) have different access permissions

## 🔄 API Integration

The frontend communicates with a backend API for all data operations. API endpoints include:

- Authentication: `/api/v1/auth/*`
- Users: `/api/v1/user/*`
- Rooms: `/api/v1/room/*`
- Bookings: `/api/v1/booking/*`
- Issues: `/api/v1/issue/*`
- Payments: `/api/v1/payment/*`
