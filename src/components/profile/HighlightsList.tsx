import React from 'react';
import { AiOutlineTrophy } from 'react-icons/ai';
import { IconType } from 'react-icons';

export interface Highlight {
  text: string;
  icon?: IconType;
}

interface HighlightsListProps {
  highlights: Highlight[];
  icon?: IconType;
}

const HighlightsList: React.FC<HighlightsListProps> = ({ 
  highlights, 
  icon: DefaultIcon = AiOutlineTrophy 
}) => {
  return (
    <ul className="highlights-list">
      {highlights.map((highlight, index) => {
        const IconComponent = highlight.icon || DefaultIcon;
        
        return (
          <li key={index}>
            <IconComponent className="highlight-icon" /> 
            {highlight.text}
          </li>
        );
      })}
    </ul>
  );
};

export default HighlightsList;
