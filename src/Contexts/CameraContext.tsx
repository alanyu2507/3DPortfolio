// contexts/SceneContext.jsx
import { createContext, useState } from "react";

interface CameraContextType {
  cameraPosition: [number, number, number];
  setCameraPosition: (position: [number, number, number]) => void;
  cameraRotation: [number, number, number];
  setCameraRotation: (rotation: [number, number, number]) => void;
  projectsHovered: boolean;
  setProjectsHovered: (hovered: boolean) => void;
  hoveredObject: string;
  setHoveredObject: (object: string) => void;
  xCoordinate: number;
  setXCoordinate: (x: number) => void;
  yCoordinate: number;
  setYCoordinate: (y: number) => void;
  clickedObject: string;
  setClickedObject: (object: string) => void;
  isZoomedIn: boolean;
  setIsZoomedIn: (zoomed: boolean) => void;
}

export const CameraContext = createContext<CameraContextType>({} as CameraContextType);

export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 5, 10]);
  const [cameraRotation, setCameraRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [projectsHovered, setProjectsHovered] = useState(false);
  const [hoveredObject, setHoveredObject] = useState("None");
  const [xCoordinate, setXCoordinate] = useState(0);
  const [yCoordinate, setYCoordinate] = useState(0);
  const [clickedObject, setClickedObject] = useState("None");
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  return (
    <CameraContext.Provider value={{
      cameraPosition,
      setCameraPosition,
      cameraRotation,
      setCameraRotation,
      projectsHovered,
      setProjectsHovered,
      hoveredObject,
      setHoveredObject,
      xCoordinate,
      setXCoordinate,
      yCoordinate,
      setYCoordinate,
      clickedObject,
      setClickedObject,
      isZoomedIn,
      setIsZoomedIn
    }}>
      {children}
    </CameraContext.Provider>
  );
};
