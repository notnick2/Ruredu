import React from 'react';
import Content from './content';
import Tasks from './tasks';

const Home = () => {
  return (
    /*<div className="flex flex-wrap">
      
      <div className="flex-1 ml-4 p-4 md:ml-0">
        <Content />
      </div>

      <div className="flex-1">
        <Tasks />
      </div>
    </div>*/
    <>
    <div className="md:flex md:flex-wrap">
    <div className="md:flex-1 md:ml-4 md:p-4 ">
    <Content/>
    </div>
    <div className="md:flex-1 md:mt-4">
      <Tasks/>
    </div>
    </div>
    </>
  );
};

export default Home;
