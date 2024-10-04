'use client';

import React, { useState } from 'react';
import Tabs from '@/app/customer/components/Tabs';
import Q1 from '@/app/client/components/q1';
import Slide from '@/app/client/components/slide';

const ProceedPage = () => {
  const [activeTab, setActiveTab] = useState('Search');
  const tabs = ['Search', 'Likes', 'Ranking', 'History', 'Settings'];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({ q1: '' });
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (answers.q1) {
      setError(null);
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setError('選択肢を選んでください。');
    }
  };

  const handlePrev = () => {
    setError(null);
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, q1: option }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Search':
        return (
          <Slide
            onPrev={handlePrev}
            onNext={handleNext}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={1}
            error={error}
            isConfirmPage={false}
          >
            <Q1
              onNext={handleOptionSelect}
              selectedOption={answers.q1}
              setSelectedOption={(option: string) => handleOptionSelect(option)}
            />
          </Slide>
        );
      case 'Likes':
        return <div>Likes content here</div>;
      case 'Ranking':
        return <div>Ranking content here</div>;
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
        <div className='mt-4'>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProceedPage;
