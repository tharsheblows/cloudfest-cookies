import React, { useState } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/solid';

const navItems = [
  { name: 'Overview', href: '#' },
  { name: '1st Party', href: '#' },
  { name: '3rd Party', href: '#' },
  { name: 'Settings', href: '#' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="md:hidden p-4">
        <button onClick={toggleSidebar}>
          <MenuIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
      <aside
        className={`transform top-0 left-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="md:hidden p-4">
          <button onClick={toggleSidebar}>
            <XIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        <nav>
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </aside>
      <main className="p-4 md:ml-64">{/* Your main content goes here */}</main>
    </div>
  );
};

export default Sidebar;
