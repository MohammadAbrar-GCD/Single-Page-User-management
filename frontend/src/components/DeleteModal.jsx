function DeleteModal({
  showDeleteModal,
  confirmDelete,
  cancelDelete
}) {

  // Don't show anything if modal is closed
  if (!showDeleteModal) {
    return null;
  }

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>Confirm Delete</h2>

        <p>
          Are you sure you want to delete this user?
        </p>

        <button
          className="edit-btn"
          onClick={cancelDelete}
        >
          Cancel
        </button>

        {" "}

        <button
          className="delete-btn"
          onClick={confirmDelete}
        >
          Delete
        </button>

      </div>

    </div>

  );
}

export default DeleteModal;