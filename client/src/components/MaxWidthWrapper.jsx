import React from 'react';


const MaxWidthWrapper = ({ children }) => {
  return (
    <div className="max-w-8xl flex justify-center px-2 md:px-8 lg:px-16">
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
