export const AUTH_EVENTS = {
  PASSWORD_RESET_REQUESTED: 'auth.password_reset_requested',
  USER_REGISTERED: 'auth.user_registered',
};

export interface IPasswordResetEvent {
  nome: string;
  email: string;
  url: string;
}