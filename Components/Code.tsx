import React from "react";

interface CodeProps {
  roomCode: string;
  setRoomCode: (code: string) => void;
  joinRoom: () => void;
}

const Code: React.FC<CodeProps> = ({ roomCode, setRoomCode, joinRoom }) => {
  return (
    <div>
      <div className="flex justify-center mt-[300px] space-x-2">
        <input
          placeholder="Room Code"
          className="border-black border outline-none rounded-md text-center caps"
          maxLength={4}
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button
          onClick={joinRoom}
          className="border pl-2 pr-2 rounded-md bg-green-500"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default Code;
