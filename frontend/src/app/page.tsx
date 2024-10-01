import React from 'react';

export default function HomePage() {
  return (
    <>
      <header className='bg-white shadow-sm'>
        <nav className='container mx-auto px-4 py-6 flex justify-between items-center'>
          <div className='text-2xl font-bold text-blue-600'>Your Logo</div>
          <ul className='flex space-x-6'>
            <li>
              <a href='#' className='text-gray-600 hover:text-blue-600 text-lg'>
                Home
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-600 hover:text-blue-600 text-lg'>
                About
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-600 hover:text-blue-600 text-lg'>
                Services
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-600 hover:text-blue-600 text-lg'>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className='min-h-screen'>
        <section className='container mx-auto py-24'>
          <div className='flex flex-wrap items-center'>
            <div className='w-full lg:w-1/2 lg:pr-10 mb-10 lg:mb-0'>
              <div className='w-full max-w-lg'>
                <div className='rounded-xl overflow-hidden'>
                  <div className='w-full h-96 bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 rounded-xl'></div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-1/2'>
              <span className='text-blue-600 font-bold uppercase tracking-widest text-xs mb-4 block'>
                YOUR TAGLINE
              </span>
              <h1 className='text-4xl md:text-5xl font-semibold leading-tight mb-6'>
                omiyage APP
              </h1>
              <p className='text-gray-600 mb-8'>
                Free and Premium themes, UI Kit's, templates and landing pages
                built with Tailwind CSS, HTML & Next.js.
              </p>
              <div className='flex flex-wrap'>
                <button className='bg-blue-600 text-white rounded-lg px-6 py-3 font-medium mr-4 mb-4 hover:bg-blue-700 transition duration-300'>
                  ログインして始める
                </button>
                <button className='border border-gray-300 text-gray-600 rounded-lg px-6 py-3 font-medium flex items-center hover:bg-gray-100 transition duration-300'>
                  See Features
                  <svg
                    className='w-5 h-5 ml-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
