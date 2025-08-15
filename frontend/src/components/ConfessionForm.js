import React, { useState } from 'react';

function ConfessionForm({ onSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '' || text.length > 280) {
      alert('Confession must be between 1 and 280 characters.');
      return;
    }
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-4 bg-white shadow-md rounded">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your confession..."
        className="w-full p-2 border rounded mb-2"
        rows="4"
      ></textarea>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Post Confession
      </button>
    </form>
  );
}

export default ConfessionForm;
