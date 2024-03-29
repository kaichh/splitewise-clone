import axios from "axios";

const baseUrl = "http://localhost:8080/";

const request = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Users
export const getAllUsers = async () => request.get("/users");
export const getUserById = async (id) => request.get(`/users/${id}`);
export const createUser = async (data) => request.post("/users", data);

// Groups
export const getAllGroups = async () => request.get("/groups");
export const getGroupById = async (id) => request.get(`/groups/${id}`);
export const createGroup = async (data) => request.post("/groups", data);
export const addMemberToGroup = async (groupId, data) =>
  request.post(`/groups/${groupId}/members`, data);

// Transactions
export const getTransactionsByGroupId = async (groupId) =>
  request.get(`/transactions/${groupId}`);
export const createTransaction = async (data) =>
  request.post("/transactions", data);
export const updateTransaction = async (id, data) =>
  request.put(`/transactions/${id}`, data);
export const deleteTransaction = async (id) =>
  request.delete(`/transactions/${id}`);

// Balance
export const getGroupBalanceByMember = async (groupId, userId) =>
  request.get(`/balance/group?groupId=${groupId}&userId=${userId}`);
export const getUserBalance = async (userId) =>
  request.get(`/balance/user/${userId}`);
