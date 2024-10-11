import React, { useState, createContext, useContext, ReactNode } from "react";
import "./styles/ConfirmDialog.css";


interface ConfirmDialogContextProps {
  show: (
    header: string,
    text: string,
    accept: string,
    decline: string,
    onAccept: () => void,
    onDecline?: () => void
  ) => void;
}


interface ConfirmDialogProviderProps {
  children: ReactNode;
}


const ConfirmDialogContext = createContext<ConfirmDialogContextProps | undefined>(undefined);

const ConfirmDialogProvider: React.FC<ConfirmDialogProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");
  const [acceptText, setAcceptText] = useState("");
  const [declineText, setDeclineText] = useState("");
  const [acceptCallback, setAcceptCallback] = useState<(() => void) | null>(null);
  const [declineCallback, setDeclineCallback] = useState<(() => void) | null>(null);

  const show = (
    alertHeader: string,
    alertText: string,
    accept: string,
    decline: string,
    onAccept: () => void,
    onDecline?: () => void
  ) => {
    setHeader(alertHeader);
    setText(alertText);
    setAcceptText(accept);
    setDeclineText(decline);
    setAcceptCallback(() => onAccept);
    setDeclineCallback(() => onDecline || null);
    setIsOpen(true);
  };

  const accept = () => {
    if (acceptCallback) {
      acceptCallback();
    }
    setIsOpen(false);
  };

  const decline = () => {
    if (declineCallback) {
      declineCallback();
    }
    setIsOpen(false);
  };

  return (
    <ConfirmDialogContext.Provider value={{ show }}>
      {children}
      <div className={isOpen ? "dialog_bg active" : "dialog_bg"} onClick={decline}>
          <div className={isOpen ? "dialog_window active" : "dialog_window"} onClick={(e) => e.stopPropagation()}>
            <div className="dialog_header">
              <h1>{header}</h1>
            </div>
            <div className="dialog_text">
              <p>{text}</p>
            </div>
            <div className="dialog_buttons">
              <button className="dialog_button" onClick={decline}>
                {declineText}
              </button>
              <button onClick={accept}>{acceptText}</button>
            </div>
          </div>
        </div>
    </ConfirmDialogContext.Provider>
  );
};

const useConfirmDialog = (): ConfirmDialogContextProps => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
  }
  return context;
};

export { ConfirmDialogProvider, useConfirmDialog };
