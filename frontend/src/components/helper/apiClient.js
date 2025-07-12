import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

const apiClient = {
  register: async (formData) => {
    const res = await API.post('/user/register', formData);
    return res.data;
  },

  login: async (formData) => {
    const res = await API.post('/user/login', formData);
    return res.data;
  },

  getUser: async (userId) => {
    const res = await API.get(`/user/${userId}`);
    return res.data;
  },


  createTestUsers: async () => {
    const res = await API.post('/user/create-test-users');
    return res.data;
  },

  deleteMessage: async (messageId, senderId) => {
    const res = await API.delete(`/message/${messageId}`, {
      data: { sender_id: senderId }
    });
    return res.data;
  },

  forwardMessage: async (senderId, receiverId, messageId) => {
    const res = await API.post('/message/forward', {
      sender_id: senderId,
      receiver_id: receiverId,
      messageId,
    });
    return res.data;
  },

  addReaction: async (messageId, userId, emoji) => {
    const res = await API.post(`/message/${messageId}/reaction`, {
      userId,
      emoji,
    });
    return res.data;
  },

  createGroup: async ({ name, members, created_by }) => {
    const res = await API.post('/group/create', { name, members, created_by });
    return res.data;
  },

  getGroupsForUser: async (userId) => {
    const res = await API.get(`/group/user/${userId}`);
    return res.data;
  },

  getGroupMessages: async (groupId) => {
    const res = await API.get(`/group/${groupId}/messages`);
    return res.data;
  },

  sendGroupMessage: async ({ group_id, sender_id, text }) => {
    const res = await API.post('/group/message/send', { group_id, sender_id, text });
    return res.data;
  },

  getUserList: async () => {
  const res = await API.get('/userlist/list');
  return res.data;
},

uploadProfileImage: async (userId, formData) => {
  const res = await API.post(`/user/upload/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
},

updatePassword: async (userId, newPassword) => {
  const res = await API.put(`/user/password/${userId}`, { password: newPassword });
  return res.data;
},

};

export default apiClient;
