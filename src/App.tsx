import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Todo } from './components/pages/Todo';
import { ConfirmDialogProvider } from './components/ui/ConfirmDialog';
import { InputDialogProvider } from './components/ui/InputDialog';
import './App.css';

function App() {
  useEffect(() => {
    const setVh = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();

    window.addEventListener('resize', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []); 


  return (
    <ConfirmDialogProvider>
        <InputDialogProvider>
            <Router>
                <Routes>
                    <Route path="/*" element={<Todo />} />
                </Routes>
            </Router>
        </InputDialogProvider>
    </ConfirmDialogProvider>
);
}

export default App;
