import { useEffect, useState } from "react";
import axios from "axios";
import TaskFilter from "../components/TaskFilter";



axios.defaults.baseURL = "http://localhost:3000/api";



function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [users, setUsers] = useState([]);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const realProjectId = '64cdef1234567890abcdef12'; // Replace with real one
      const resTasks = await axios.get(`/tasks/project/${realProjectId}`);
      const resUsers = await axios.get('/users');
      setTasks(resTasks.data);
      setFilteredTasks(resTasks.data);
      setUsers(resUsers.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  fetchData();
}, []);
  const handleFilterChange = (filters) => {
    let filtered = [...tasks];

    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.assignedTo) {
      filtered = filtered.filter(t => t.assignedTo === filters.assignedTo);
    }
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(keyword) ||
          (t.description && t.description.toLowerCase().includes(keyword))
      );
    }
    if (filters.due) {
      const now = new Date();
      if (filters.due === "today") {
        filtered = filtered.filter(t =>
          new Date(t.dueDate).toDateString() === now.toDateString()
        );
      } else if (filters.due === "week") {
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        filtered = filtered.filter(t => {
          const due = new Date(t.dueDate);
          return due >= now && due <= nextWeek;
        });
      } else if (filters.due === "overdue") {
        filtered = filtered.filter(t => new Date(t.dueDate) < now);
      }
    }

    setFilteredTasks(filtered);
  };

  return (
    <main className="container">
      <h1>All Tasks</h1>
      <TaskFilter onFilterChange={handleFilterChange} users={users} />

      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <small>Status: {task.status}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default TaskListPage;