import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(API_URL, { title: newTitle });
      setTodos([response.data, ...todos]);
      setNewTitle('');
    } catch (err) {
      setError('Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    setLoading(true);
    setError(null);
    try {
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`${API_URL}/${id}`, {
        title: todo.title,
        completed: !completed,
      });
      setTodos(todos.map(t => (t._id === id ? response.data : t)));
    } catch (err) {
      setError('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">TODO List</h1>
        <form onSubmit={handleAddTodo} className="flex mb-4">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            Add
          </button>
        </form>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-center mb-4">Loading...</p>}
        {!loading && todos.length === 0 && (
          <p className="text-center text-gray-500">No tasks found. Add a new task!</p>
        )}
        <ul>
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between border-b border-gray-200 py-2"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo._id, todo.completed)}
                  disabled={loading}
                  className="mr-3"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo._id)}
                disabled={loading}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete task"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
