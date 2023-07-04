import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AttendanceInterface {
  id?: string;
  selfie: string;
  time: any;
  location: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface AttendanceGetQueryInterface extends GetQueryInterface {
  id?: string;
  selfie?: string;
  location?: string;
  user_id?: string;
}
