// Import React hooks
import { useEffect, useState } from "react";

// Import Axios for talking to backend
import axios from "axios";

import UserCard from "./components/UserCard";

import DeleteModal from "./components/DeleteModal";

import UserForm from "./components/UserForm";

function App() {

  // Stores all users from database
  const [users, setUsers] = useState([]);

  // Stores name textbox value
  const [name, setName] = useState("");

  // Stores email textbox value
  const [email, setEmail] = useState("");

  // Stores the id of the user currently being edited
  const [editingId, setEditingId] = useState(null);

  // Stores validation error messages
  const [error, setError] = useState("");

  // Controls whether delete modal is visible
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Stores which user will be deleted
  const [userToDelete, setUserToDelete] = useState(null);

  // Stores search text
  const [searchTerm, setSearchTerm] = useState("");

  // Stores current sort order
  const [sortOrder, setSortOrder] = useState("A-Z");

  const [notification, setNotification] = useState("");

  const [loading, setLoading] = useState(true);

  // Function that loads users from backend
const loadUsers = async () => {

  try {

    const response = await axios.get(
      "http://localhost:5000/users"
    );

    setUsers(response.data);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};


  // Runs once when page first loads
  useEffect(() => {

  loadUsers();

}, []);

  // Function called when Add User button is clicked
  const addUser = async () => {

  // Check if name is empty
  if (name.trim() === "") {
    setError("Please enter a name");
    return;
  }

  // Check if email is empty
  if (email.trim() === "") {
    setError("Please enter an email");
    return;
  }

  setError("");

  // Send new user to backend
  await axios.post(
    "http://localhost:5000/users",
    {
      name,
      email
    }
  );

  // Clear textboxes
  setName("");
  setEmail("");

  // Reload users from database
  loadUsers();

  setNotification("User added successfully");

setTimeout(() => {
  setNotification("");
}, 3000);

};

  // Opens delete confirmation modal
  const deleteUser = (id) => {

    setUserToDelete(id);

    setShowDeleteModal(true);
};

  const confirmDelete = async () => {

  await axios.delete(
    `http://localhost:5000/users/${userToDelete}`
  );

  loadUsers();

setNotification("User deleted successfully");

setTimeout(() => {
  setNotification("");
}, 3000);

setShowDeleteModal(false);

  setUserToDelete(null);
};

  const cancelDelete = () => {

  setShowDeleteModal(false);

  setUserToDelete(null);
};

  // Function called when Edit button is clicked
  const editUser = (user) => {

    // Put selected user's data into the form
    setName(user.name);
    setEmail(user.email);

    // Remember which user is being edited
    setEditingId(user.id);

  };

  // Function called when Update User button is clicked
  const updateUser = async () => {

  // Check if name is empty
  if (name.trim() === "") {
    setError("Please enter a name");
    return;
  }

  // Check if email is empty
  if (email.trim() === "") {
    setError("Please enter an email");
    return;
  }

  setError("");

  await axios.put(
    `http://localhost:5000/users/${editingId}`,
    {
      name,
      email
    }
  );

  // Clear form
  setName("");
  setEmail("");

  // Exit edit mode
  setEditingId(null);

  // Reload users from database
  loadUsers();

setNotification("User updated successfully");

setTimeout(() => {
  setNotification("");
}, 3000);

  
};


const filteredUsers = users.filter((user) => {

  return (
    user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    user.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  })

  .sort((a, b) => {

    if (sortOrder === "A-Z") {
      return a.name.localeCompare(b.name);
    }

    return b.name.localeCompare(a.name);

  });



  return (
    <div className="app-container">

    <h1>User Management System</h1>

    {notification && (
  <div
    style={{
      background: "#22c55e",
      color: "white",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontWeight: "bold"
    }}
  >
    {notification}
  </div>
)}

<UserForm
  name={name}
  setName={setName}
  email={email}
  setEmail={setEmail}
  editingId={editingId}
  addUser={addUser}
  updateUser={updateUser}
  error={error}
/>



<br />

<h3>Search Users</h3>

<input
  type="text"
  placeholder="Search by name or email..."
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
/>

<p>
  Found {filteredUsers.length} user(s)
</p>

<h3>Sort Users</h3>

<button
  className="edit-btn"
  onClick={() => setSortOrder("A-Z")}
>
  A-Z
</button>

{" "}

<button
  className="delete-btn"
  onClick={() => setSortOrder("Z-A")}
>
  Z-A
</button>

<p>
  Current Sort: {sortOrder}
</p>

<br />

{loading && (
  <h3>Loading users...</h3>
)}


      {/* Display all users */}
      {!loading && filteredUsers.map((user) => (

  <UserCard
    key={user.id}
    user={user}
    editUser={editUser}
    deleteUser={deleteUser}
  />

))}

      <DeleteModal
  showDeleteModal={showDeleteModal}
  confirmDelete={confirmDelete}
  cancelDelete={cancelDelete}
/>

    </div>
  );
}

export default App;