import React, { useState, createContext, useContext, ReactNode } from "react";
import "./styles/InputDialog.css";

interface InputDialogContextProps {
  show: (
    header: string,
    placeholderValue: string,
    inputValue: string,
    accept: string,
    decline: string,
    onAccept: (inputValue: string) => void,
    onDecline?: () => void
  ) => void;
}

interface InputDialogProviderProps {
  children: ReactNode;
}

const InputDialogContext = createContext<InputDialogContextProps | undefined>(undefined);

const InputDialogProvider: React.FC<InputDialogProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [header, setHeader] = useState("");
  const [placeholderValue, setPlaceholderValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [acceptText, setAcceptText] = useState("");
  const [declineText, setDeclineText] = useState("");
  const [acceptCallback, setAcceptCallback] = useState<((inputValue: string) => void) | null>(null);
  const [declineCallback, setDeclineCallback] = useState<(() => void) | null>(null);

  const show = (
    alertHeader: string,
    alertPlaceholder: string,
    alertInput: string,
    accept: string,
    decline: string,
    onAccept: (inputValue: string) => void,
    onDecline?: () => void
  ) => {
    setHeader(alertHeader);
    setPlaceholderValue(alertPlaceholder);
    setInputValue(alertInput);
    setAcceptText(accept);
    setDeclineText(decline);
    setAcceptCallback(() => onAccept);
    setDeclineCallback(() => onDecline || null);
    setIsOpen(true);
  };

  const accept = () => {
    if (inputValue !== "") {
        if (acceptCallback) {
            acceptCallback(inputValue); 
          }
          setIsOpen(false);
    }
  };

  const decline = () => {
    if (declineCallback) {
      declineCallback();
    }
    setIsOpen(false);
  };

  return (
    <InputDialogContext.Provider value={{ show }}>
      {children}
      <div className={isOpen ? "dialog_bg active" : "dialog_bg"} onClick={decline}>
        <div className={isOpen ? "dialog_window active" : "dialog_window"} onClick={(e) => e.stopPropagation()}>
            <div className="dialog_header">
                <h1>{header}</h1>
            </div>
            <div className="dialog_parent_input_container">
                <div className="dialog_input_container">
                    <input
                    id="dialog_input"
                    className="dialog_input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder=""
                    />
                    <label className="placeholder" htmlFor="dialog_input">{placeholderValue}</label>
                </div>
            </div>
            <div className="dialog_buttons">
            <button className="dialog_button" onClick={decline}>
              {declineText}
            </button>
            <button className={inputValue !== "" ? "dialog_button" : "dialog_button inactive"} onClick={accept}>
              {acceptText}
            </button>
          </div>
        </div>
      </div>
    </InputDialogContext.Provider>
  );
};

const useInputDialog = (): InputDialogContextProps => {
  const context = useContext(InputDialogContext);
  if (!context) {
    throw new Error("useInputDialog must be used within a InputDialogProvider");
  }
  return context;
};

export { InputDialogProvider, useInputDialog };
