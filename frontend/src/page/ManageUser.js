import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { BiEdit, BiTrash, BiSave, BiX } from "react-icons/bi";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users.");
    }
  };

  const handleEditChange = (name, value) => {
    setEditedUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    const userToEdit = users.find((user) => user._id === userId);
    setEditedUserData({
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      email: userToEdit.email,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUserData({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/edit-user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUserData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("User information updated successfully");
      setEditingUserId(null);
      setEditedUserData({
        firstName: "",
        lastName: "",
        email: "",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating user information.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/delete-user/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting user.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Users</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>First Name</th>
            <th style={styles.tableHeader}>Last Name</th>
            <th style={styles.tableHeader}>Email</th>
            <th style={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={styles.tableCell}>
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    value={editedUserData.firstName}
                    onChange={(e) => handleEditChange("firstName", e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  user.firstName
                )}
              </td>
              <td style={styles.tableCell}>
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    value={editedUserData.lastName}
                    onChange={(e) => handleEditChange("lastName", e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  user.lastName
                )}
              </td>
              <td style={styles.tableCell}>
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    value={editedUserData.email}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    style={styles.input}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td style={styles.tableCell}>
                {editingUserId === user._id ? (
                  <>
                    <BiSave onClick={() => handleSaveEdit(user._id)} style={styles.icon} />
                    <BiX onClick={handleCancelEdit} style={styles.icon} />
                  </>
                ) : (
                  <>
                    <BiEdit onClick={() => handleEditUser(user._id)} style={styles.editIcon} />
                    <BiTrash onClick={() => handleDeleteUser(user._id)} style={styles.trashIcon} />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    margin: "20px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    padding: "10px",
    backgroundColor: "#f2f2f2",
    border: "1px solid #ddd",
    textAlign: "left",
    color: "#333",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  input: {
    width: "100%",
    padding: "8px",
  },
  icon: {
    cursor: "pointer",
    margin: "0 5px",
  },
  editIcon: {
    cursor: "pointer",
    margin: "0 5px",
    color: "#007bff",
  },
  trashIcon: {
    cursor: "pointer",
    margin: "0 5px",
    color: "#dc3545",
  },
};

export default ManageUser;
