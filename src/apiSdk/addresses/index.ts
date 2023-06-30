import axios from 'axios';
import queryString from 'query-string';
import { AddressInterface, AddressGetQueryInterface } from 'interfaces/address';
import { GetQueryInterface } from '../../interfaces';

export const getAddresses = async (query?: AddressGetQueryInterface) => {
  const response = await axios.get(`/api/addresses${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAddress = async (address: AddressInterface) => {
  const response = await axios.post('/api/addresses', address);
  return response.data;
};

export const updateAddressById = async (id: string, address: AddressInterface) => {
  const response = await axios.put(`/api/addresses/${id}`, address);
  return response.data;
};

export const getAddressById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/addresses/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAddressById = async (id: string) => {
  const response = await axios.delete(`/api/addresses/${id}`);
  return response.data;
};
