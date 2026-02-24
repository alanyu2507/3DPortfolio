import { createContext, useState, useRef } from "react";

interface FileContextType {
  fileName: string;
  setFileName: (name: string) => void;
  folderName: string;
  setFolderName: (name: string) => void;
  parentFolderName: string[];
  addParentFolder: (name: string) => void;
  removeLastParentFolder: () => void;
  getLastParentFolder: () => string | undefined;
  zoomIn: () => void;
  setZoomIn: (fn: () => void) => void;
  zoomOut: () => void;
  setZoomOut: (fn: () => void) => void;
}

export const FileContext = createContext<FileContextType>({} as FileContextType);

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
  const [fileName, setFileName] = useState<string>("");
  const [folderName, setFolderName] = useState<string>("");
  const [parentFolderName, setParentFolderName] = useState<string[]>([]);
  const zoomInRef = useRef<() => void>(() => {});
  const zoomOutRef = useRef<() => void>(() => {});

  const addParentFolder = (name: string) => {
    setParentFolderName(prev => [...prev, name]);
  };

  const removeLastParentFolder = () => {
    if (parentFolderName.length === 0) return;
    setParentFolderName(prev => prev.slice(0, -1));
  };

  const getLastParentFolder = () => {
    return parentFolderName[parentFolderName.length - 1];
  };

  const zoomIn = () => {
    zoomInRef.current();
  };

  const setZoomIn = (fn: () => void) => {
    zoomInRef.current = fn;
  };

  const zoomOut = () => {
    zoomOutRef.current();
  };

  const setZoomOut = (fn: () => void) => {
    zoomOutRef.current = fn;
  };

  return (
    <FileContext.Provider value={{
      fileName,
      setFileName,
      folderName,
      setFolderName,
      parentFolderName,
      addParentFolder,
      removeLastParentFolder,
      getLastParentFolder,
      zoomIn,
      setZoomIn,
      zoomOut,
      setZoomOut
    }}>
      {children}
    </FileContext.Provider>
  );
};
