import React from 'react';

function ConfessionFeed({ confessions, onUpvote, onDownvote }) {
  return (
    <div className="w-full max-w-2xl mt-4">
      {confessions.map((confession, index) => (
        <div key={index} className="p-4 bg-white shadow-md rounded mb-4">
          <p className="text-gray-800 mb-2">{confession.text}</p>
          <p className="text-sm text-gray-500 mb-2">
            Posted by {confession.wallet.slice(0, 6)}...{confession.wallet.slice(-4)} on {new Date(confession.timestamp * 1000).toLocaleString()}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpvote(index)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Upvote
              </button>
              <button
                onClick={() => onDownvote(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Downvote
              </button>
            </div>
            <p className="text-gray-700">Votes: {confession.votes}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConfessionFeed;
