import React, { ReactNode } from 'react';
import '../styles/contentView.css';

interface ContentViewProps {
  children: ReactNode;
}

const ContentView: React.FC<ContentViewProps> = ({ children }) => {
  return (
    <div className="content-view">
      {children}
    </div>
  );
};

export default ContentView;
