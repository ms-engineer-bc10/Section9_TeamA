'use client';
import React, { useState } from 'react';
import Tabs from '../../components/Tabs';
import Ranking from '../../components/Ranking';

const ProceedPage = () => {
  const [activeTab, setActiveTab] = useState('Search');
  const tabs = ['Search', 'Likes', 'Ranking', 'History', 'Settings'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Search':
        return <div>Search content here</div>;
      case 'Likes':
        return <div>Likes content here</div>;
      case 'Ranking':
        return <Ranking />;
      case 'History':
        return <div>History content here</div>;
      case 'Settings':
        return <div>Settings content here</div>;
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-lg p-4 mb-8 border-4 border-blue-500 rounded-md text-center bg-white shadow-md'>
        <p className='text-lg text-gray-700'>
          お気に入りのOMIYAGEを管理しましょう！
        </p>
      </div>
      <div className='w-full max-w-lg'>
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className='mt-4 p-4 bg-white rounded-md shadow-md'>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProceedPage;
