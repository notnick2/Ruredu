import React from 'react';
import Content from './content';
import Tasks from './tasks';

const Home = () => {
  return (
    <div className="flex">
      {/* Component: Content with left margin */}
      <div className="flex-1 p-4 ml-4">
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
