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

// Transactions
export const getTransactionsByGroupId = async (groupId) =>
  request.get(`/transactions/${groupId}`);

// Balance
export const getGroupBalanceByMember = async (groupId, userId) =>
  request.get(`/balance/group?groupId=${groupId}&userId=${userId}`);
export const getUserBalance = async (userId) =>
  request.get(`/balance/user/${userId}`);
