import React from "react";

import '../../../styles/main/admin/manage/UserListItem.css';

const UserListItem = ({ user, deleteUser }) => {
    return (
        <div className="user_list_item">
            <div className="user_list_section small_user_list_section">{user.userType}</div>
            <div className="user_list_section">{ new Date(user.creationTimestamp).toLocaleDateString("de-DE")}</div>
            <div className="user_list_section">{user.firstName !== undefined ? (user.firstName) : 'no name'}</div>
            <div className="user_list_section">{user.email}</div>
            <div className="user_list_section small_user_list_section" onClick={() => deleteUser(user._id)}>Delete</div>
        </div>
    );
};

export default UserListItem;
