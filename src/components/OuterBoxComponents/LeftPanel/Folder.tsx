import React, { useContext } from 'react';
import { FileContext } from '../../../Contexts/FileContext'
import './CSS/Folder.css';

interface FolderProps {
  name: string;
}

const Folder: React.FC<FolderProps> = ({ name }) => {
  const { folderName,setFolderName, addParentFolder } = useContext(FileContext)

  const handleClick = (event?: any) => {
    setFolderName(name)
    addParentFolder(folderName)
  }

  return (
    <div className="folder" onClick={handleClick}>
      {name}
    </div>
  );
};

export default Folder;
