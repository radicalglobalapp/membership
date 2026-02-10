import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.18:5000',
});

export default API;

export const getExpiringMembers = token =>
  API.get('/expiry/expiring', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getRenewalHistory = async (memberId, token) => {
  const res = await API.get(`/api/renew/history/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getPaymentHistory = async (memberId, token) => {
  const res = await API.get(`/api/transactions/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
