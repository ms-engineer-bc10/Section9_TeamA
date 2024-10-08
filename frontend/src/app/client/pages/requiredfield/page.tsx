'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import target from '@/app/client/components/target';
import genre from '@/app/client/components/genre';
import budget from '@/app/client/components/budget';
import quantity from '@/app/client/components/quantity';
import location from '@/app/client/components/location';
import Confirm from '@/app/client/components/confirm';
import Slide from '@/app/client/components/slide';
import Result from '@/app/client/components/result';
import Loading from '@/app/client/components/loading';
import MenuBar from '@/app/client/components/menubar';

type Answer = '' | string;

interface Answers {
  target: Answer;
  genre: Answer;
  budget: Answer;
  quantity: Answer;
  location: Answer;
}

const MenuItem: React.FC<{
  icon: React.ElementType;
  label: string;
  href?: string;
}> = ({ icon: Icon, label, href }) => {
  const content = (
    <>
      <Icon size={20} />
      <span className='text-xs mt-0.5'>{label}</span>
    </>
  );

  return href ? (
    <Link
      href={href}
      className='flex flex-col items-center justify-center w-full py-1 text-gray-600 hover:text-blue-500 transition-colors'
    >
      {content}
    </Link>
  ) : (
    <button className='flex flex-col items-center justify-center w-full py-1 text-gray-600 hover:text-blue-500 transition-colors'>
      {content}
    </button>
  );
};

const RequiredFieldPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    location: '',
    target: '',
    genre: '',
    budget: '',
    quantity: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const questions = [location, target, genre, budget, quantity];

  const handleNext = useCallback(() => {
    const currentAnswer =
      answers[`q${currentQuestionIndex + 1}` as keyof Answers];
    if (currentAnswer || currentQuestionIndex >= questions.length) {
      setError(null);
      if (currentQuestionIndex < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } else {
      setError('選択肢を選んでください。');
    }
  }, [currentQuestionIndex, answers, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setError(null);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      setAnswers((prev) => ({
        ...prev,
        [`q${currentQuestionIndex + 1}`]: option,
      }));
      if (currentQuestionIndex < questions.length - 1) {
        handleNext();
      }
    },
    [currentQuestionIndex, questions.length, handleNext]
  );

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          place: answers.location,
          recipient: answers.target,
          category: answers.genre,
          price: answers.budget,
          quantity: answers.quantity,
          location: '35.681236,139.767125', // ダミーの位置情報。今後位置情報取得機能を追加
        }),
      });

      // ステータスコードが200番台でない場合はエラーを投げる
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data); // 結果を保存
      setShowResult(true); // 結果を表示
    } catch (error) {
      setError('検索中にエラーが発生しました。');
      console.error('APIリクエストエラー:', error);
    } finally {
      setIsLoading(false); // ローディング終了
    }
  }, [answers]);

  const handleResetSearch = useCallback(() => {
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setAnswers({
      location: '',
      target: '',
      genre: '',
      budget: '',
      quantity: '',
    });
  }, []);

  const handleEditSearch = useCallback(() => {
    setShowResult(false);
    setCurrentQuestionIndex(0);
    // answers はリセットしない
  }, []);

  const isConfirmPage = currentQuestionIndex === questions.length;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-16'>
      <div className='w-full max-w-lg p-4 mb-8 border-4 border-[#2F41B0] rounded-md text-center bg-white shadow-md'>
        <p className='text-lg text-gray-700'>
          あなたにピッタリのOMIYAGEを見つけましょう！
        </p>
      </div>
      <div className='w-full max-w-lg'>
        {isLoading ? (
          <Loading />
        ) : showResult ? (
          <Result
            answers={answers}
            searchResults={searchResults}
            onResetSearch={handleResetSearch}
            onEditSearch={handleEditSearch}
          />
        ) : (
          <Slide
            onPrev={handlePrev}
            onNext={handleNext}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            error={error}
            isConfirmPage={isConfirmPage}
          >
            {questions.map((QuestionComponent, index) => (
              <QuestionComponent
                key={index}
                onNext={handleOptionSelect}
                selectedOption={answers[`q${index + 1}` as keyof Answers]}
                setSelectedOption={(option: string) =>
                  setAnswers((prev) => ({ ...prev, [`q${index + 1}`]: option }))
                }
              />
            ))}
            <Confirm answers={answers} onSearch={handleSearch} />
          </Slide>
        )}
      </div>
      <MenuBar />
    </div>
  );
};

export default RequiredFieldPage;
