import { useState } from "react";
import { useRouter } from "next/router";
import Code from "@/Components/Code";

const Index = () => {
  const [showCode, setShowCode] = useState(false);
  const [roomCode, setRoomCode] = useState<string>("");
  const [name, setName] = useState<string>(""); 
  const router = useRouter();

  const generateRoomID = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const createRoom = async (): Promise<void> => {
    if (!name.trim()) {
      alert("Please enter your display name.");
      return;
    }
  
    const roomId = generateRoomID();
  
    try {
      const response = await fetch("/api/createRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomCode: roomId,
          displayName: name.trim(),
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Failed to create room. Please check the console for more details.");
        return;
      }
  
      const data = await response.json();
      setName("");
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again later.");
    }
  };
  
  
  
  

  const joinRoom = async (): Promise<void> => {
    if (name.trim() === "") {
      alert("Please enter your display name.");
      return;
    }

    if (roomCode.length === 4 && /^[0-9]{4}$/.test(roomCode)) {
      try {
        const response = await fetch(`/api/joinRoom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomCode, displayName: name }),
        });

        const data = await response.json();

        if (response.ok) {
          setName("");
          router.push(`/room/${roomCode}`);
        } else {
          alert(data.error || 'Failed to join the room. Please try again later.');
        }
      } catch (error) {
        alert("Failed to join the room. Please try again later.");
      }
    } else {
      alert("The room code is invalid. Please enter a valid 4-digit code.");
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
          placeholder="Enter Display Name"
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
