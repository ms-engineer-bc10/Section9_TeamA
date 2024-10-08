import React from 'react';
import Link from 'next/link';
import { Home, Clock, Heart, Crown } from 'lucide-react';

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

const MenuBar: React.FC = () => {
  return (
    <div className='fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-full flex justify-around items-center h-14 w-full max-w-lg shadow-lg'>
      <MenuItem icon={Home} label='Home' href='/client/pages/requiredfield' />
      <MenuItem icon={Clock} label='History' href='/client/pages/history' />
      <MenuItem icon={Heart} label='Likes' href='/client/pages/likes' />
      <MenuItem icon={Crown} label='Ranking' href='/client/pages/ranking' />
    </div>
  );
};

export default MenuBar;
