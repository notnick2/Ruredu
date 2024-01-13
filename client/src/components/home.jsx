import React from 'react';
import Content from './content';
import Tasks from './tasks';

const Home = () => {
  return (
    <div className="flex flex-wrap">
      {/* Component: Content with left margin on larger screens */}
      <div className="flex-1 p-4 ml-4 md:ml-0">
        <Content />
      </div>

      {/* Component: Tasks without margin */}
      <div className="flex-1 p-4">
        <Tasks />
      </div>
    </div>
  );
};

export default Home;
