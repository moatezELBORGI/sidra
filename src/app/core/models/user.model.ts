export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  structure: string;
  phone: string;
  password?: string;
  permissions: {
    manageRequests: boolean;
    manageOffers: boolean;
    manageUsers: boolean;
    manageSettings: boolean;
    accessDashboard: boolean;
  };
  isBlocked: boolean;
  lastLogin?: string;
  status: 'online' | 'offline';
}