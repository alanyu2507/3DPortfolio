import { createContext, useState } from "react";

interface RoomContextType {
  roomName: string;
  setRoomName: (name: string) => void;
}

export const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [roomName, setRoomName] = useState<string>("Bedroom");

  return (
    <RoomContext.Provider value={{
      roomName,
      setRoomName
    }}>
      {children}
    </RoomContext.Provider>
  );
};
