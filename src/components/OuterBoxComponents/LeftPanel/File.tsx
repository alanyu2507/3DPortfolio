import React, { useContext } from 'react'
import './CSS/File.css'
import { FileContext } from '../../../Contexts/FileContext';

interface FolderProps {
  name: string;
}

const File: React.FC<FolderProps> = ({ name }) => {
  const { setFileName } = useContext(FileContext)

  const handleClick = (event?: any) => {
    setFileName(name)
  }

  return (
    <div className="file" onClick={handleClick}>
      {name}
    </div>
  );
};

export default File;
