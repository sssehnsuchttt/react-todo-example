import React from 'react';
import './styles/Tabs.css';

interface TabsProps {
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  return (
    <div className="tabs_container">
      {children}
    </div>
  );
};

interface TabProps {
    active: boolean;
    onClick: () => void;
    text: string;
  }
  
const Tab: React.FC<TabProps> = ({ active, onClick, text }) => {
return (
    <button
    className={`tab_button ${active ? 'active' : ''}`}
    onClick={onClick}
    >
    {text}
    </button>
);
};


export { Tabs, Tab};
