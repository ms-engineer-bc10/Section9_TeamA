import React from 'react';
import Link from 'next/link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import LoyaltyRoundedIcon from '@mui/icons-material/LoyaltyRounded';

const Menubar: React.FC = () => {
  return (
    <nav className='bg-white shadow-md fixed bottom-0 left-0 right-0'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <Link
            href='/'
            className='flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
          >
            <HomeRoundedIcon className='w-6 h-6' />
          </Link>
          <Link
            href='/books'
            className='flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
          >
            <MenuBookRoundedIcon className='w-6 h-6' />
          </Link>
          <Link
            href='/favorites'
            className='flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
          >
            <StarBorderRoundedIcon className='w-6 h-6' />
          </Link>
          <Link
            href='/tags'
            className='flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
          >
            <LoyaltyRoundedIcon className='w-6 h-6' />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
