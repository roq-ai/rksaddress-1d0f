import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface AddressInterface {
  id?: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface AddressGetQueryInterface extends GetQueryInterface {
  id?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  organization_id?: string;
}
