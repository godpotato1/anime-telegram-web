import React from 'react';

export default function AnimeCard({ title, description, link, image }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-md mb-4" />
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-sm flex-grow">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-center"
      >
        مشاهده
      </a>
    </div>
  );
}