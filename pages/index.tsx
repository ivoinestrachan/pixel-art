import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Code from "@/Components/Code";

const Index = () => {
  const [showCode, setShowCode] = useState(false);
  const [roomCode, setRoomCode] = useState<string>("");
  const [validRooms, setValidRooms] = useState<string[]>([]);
  const [name, setName] = useState<string>(""); 
  const router = useRouter();

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("validRooms") || "[]");
    setValidRooms(storedRooms);
  }, []);

  const generateRoomID = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const createRoom = async (): Promise<void> => {
    if (name === "") {
      alert("Please enter your display name.");
      return;
    }
    
    const roomId = generateRoomID();
    const updatedRooms = [...validRooms, roomId];
    setValidRooms(updatedRooms);
    localStorage.setItem("validRooms", JSON.stringify(updatedRooms));
    localStorage.setItem("userName", name); 

    try {
      const response = await fetch('/api/createRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCode: roomId,
          displayName: name,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/room/${roomId}`);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Failed to create room. Please try again later.');
    }
  };

  const joinRoom = (): void => {
    if (roomCode.length === 4 && validRooms.includes(roomCode)) {
      if (name === "") {
        alert("Please enter your display name.");
        return;
      }
      localStorage.setItem("userName", name); 
      router.push(`/room/${roomCode}`);
    } else {
      alert("The room code does not exist. Please try again.");
    }
  };

  return (
    <div>
      {showCode && (
        <Code
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          joinRoom={joinRoom}
        />
      )}
      <div className="flex justify-center mt-[5vh]">
        <input
          type="text"
          placeholder="user here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-black rounded-md text-center p-2 outline-none"
        />
      </div>
      <div className="flex justify-center mt-[5vh]">
        <button
          onClick={createRoom}
          className="py-1 pr-2 pl-2 bg-black rounded-md text-white text-[2rem]"
        >
          Create A Room
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <button
          onClick={() => setShowCode(true)}
          className="py-1 pr-7 pl-7 bg-green-500 rounded-md text-white text-[2rem]"
        >
          Join A Room
        </button>
      </div>
    </div>
  );
};

export default Index;
