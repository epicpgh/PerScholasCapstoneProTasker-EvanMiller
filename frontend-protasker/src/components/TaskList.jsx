import { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import TaskFilter from '../components/TaskFilter';
import axios from 'axios';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/tasks')
      .then(res => setTasks(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch tasks.');
      })
      .finally(() => setLoading(false));
  }, []);
   <ul>
      {tasks.map(task => (
        <li key={task._id}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}
             <strong style={{ color: task.priority === "high" ? "red" : "black" }}>
    {task.priority}
  </strong>
            </p> {''}
        </li>
      ))}
    </ul>

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px"
          }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>
            Priority:{" "}
            <strong style={{ color: task.priority === "High" ? "red" : "black" }}>
              {task.priority || "Medium"}
            </strong>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default TaskListPage;
