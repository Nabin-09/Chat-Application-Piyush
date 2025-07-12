import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../helper/apiClient';
import GroupCreateModal from './GroupCreateModal';
import styles from '../css/UserList.module.css';

function UserList({ onSelectChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const { type, id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      try {
        const userList = await apiClient.getUserList();
        const groupList = await apiClient.getGroupsForUser(user.id);
        setFriends(userList);
        setGroups(groupList);
      } catch (err) {
        console.error('Error fetching user/group lists:', err);
      }
    };

    fetchData();
  }, [showGroupModal]);

  const filteredList = (viewMode === 'friends' ? friends : groups).filter(item =>
    (item.username || item.name)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewModeType = viewMode === 'friends' ? 'user' : 'group';

  return (
    <div className={styles.userListContainer}>
      <div className={styles.header}>
        <input
          type="text"
          placeholder={`Search ${viewMode === 'friends' ? 'friends' : 'groups'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.toggleContainer}>
          <button
            onClick={() => setViewMode('friends')}
            className={viewMode === 'friends' ? styles.activeToggle : styles.toggle}
          >
            Friends
          </button>
          <button
            onClick={() => setViewMode('groups')}
            className={viewMode === 'groups' ? styles.activeToggle : styles.toggle}
          >
            Groups
          </button>
        </div>
      </div>

      <ul className={styles.userList}>
        {filteredList.map((item) => (
          <li
            key={item.id}
            className={`${styles.userItem} ${
              id === item.id.toString() && type === viewModeType ? styles.activeItem : ''
            }`}
            onClick={() => onSelectChat(viewModeType, item.id)}
          >
            {viewMode === 'friends' ? item.username : item.name}
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <button
          onClick={() => setShowGroupModal(true)}
          className={styles.createGroupButton}
        >
          + Create Group
        </button>
      </div>
      {showGroupModal && <GroupCreateModal onClose={() => setShowGroupModal(false)} />}
    </div>
  );
}

export default UserList;
