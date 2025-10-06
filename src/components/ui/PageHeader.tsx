import React from 'react';
import './styles/PageHeader.css';

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <div className="page-header-text">
          <h1 className="page-title">{title}</h1>
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
