function TaskForm({ task, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        id="title"
        onChange={onChange}
        type="text"
        name="title"
        value={task.title}
        required
        style={{ marginBottom: "1rem" }}
      />
      {/* Add other fields similarly */}
      <button type="submit">Update Task</button>
    </form>
  );
}

export default TaskForm;