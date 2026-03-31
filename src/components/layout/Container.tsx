import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className = "" }: ContainerProps): React.ReactElement => {
  return (
    <main className={`max-w-7xl mx-auto px-4 py-6 ${className}`}>
      {children}
    </main>
  );
};

export default Container;
