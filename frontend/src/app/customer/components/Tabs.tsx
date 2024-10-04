import React from 'react';

type TabsProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className='flex space-x-1 rounded-lg bg-gray-100 p-1'>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all focus:outline-none ${
            activeTab === tab
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
