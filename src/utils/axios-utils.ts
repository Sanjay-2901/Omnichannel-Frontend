import axios from 'axios';
import { environment } from '../environments/environment';

const client = axios.create({
  baseURL: environment.apiUrl,
});

export const httpRequest = ({ ...options }) => {
  const authorizationToken = localStorage.getItem('authorization_token');
  if (authorizationToken) {
    client.defaults.headers.common.Authorization = `${authorizationToken}`;
  }
  const onSuccess = (success: any) => success;
  const onError = (error: any) => error;

  return client(options).then(onSuccess).catch(onError);
};
