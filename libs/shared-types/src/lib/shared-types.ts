export interface UserData {
  id: string;
  email: string;
  role: string;
}

export class RegisterDto {
  email!: string;
  password!: string;
}

export class LoginDto {
  email!: string;
  password!: string;
}

export class LogMessageDto {
  serviceName!: string;
  level!: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message!: string;
  timestamp!: string;
  meta?: Record<string, any>;
}
