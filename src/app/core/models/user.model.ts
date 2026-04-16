export interface User {
  username: string;
  email: string;
  role: 'admin' | 'user';
  displayName: string;
}