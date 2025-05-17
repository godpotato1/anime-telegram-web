import React from 'react';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <h1 className="text-3xl font-bold text-gray-900">Anime Explorer</h1>
        </div>
      </header>

      {/* Search Section */}
      <section className="mt-6 max-w-7xl mx-auto px-6">
        <input
          type="text"
          placeholder="جستجوی انیمه..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </section>

      {/* Grid of Anime Cards */}
      <main className="mt-8 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Card */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="h-48 bg-gray-200 rounded-md mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Anime Title</h2>
            <p className="text-gray-600 text-sm mb-4">Short description of the anime goes here.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full">مشاهده</button>
          </div>
          {/* Repeat cards dynamically */}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white shadow-inner">
        <div className="max-w-7xl mx-auto py-4 px-6 text-center text-gray-500 text-sm">
          © 2025 Anime Explorer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
