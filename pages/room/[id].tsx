import { useRouter } from "next/router";
import { FC, useState, useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Room: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(
    id ? `/api/getRoomPlayers?roomCode=${id}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  const [players, setPlayers] = useState<string[]>([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (data) {
      setPlayers(data.players.map((player: any) => player.displayName));

      const currentUser = localStorage.getItem("userName");

      if (currentUser && data.players[0]?.displayName === currentUser) {
        setIsCreator(true);
      }
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Failed to load room data.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative text-right mr-10 top-10">{players.length}/5</div>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-[3rem] font-bold">{id}</h1>
        <p className="text-[1.5rem] mt-4">
          Invite others to join using the room code: {id}
        </p>

        <div className="mt-2">
          <h3 className="text-lg">Players:</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                {index === 0 && <span>👑 </span>}
                {player}
              </li>
            ))}
          </ul>
        </div>

        {isCreator ? (
          <div className="mt-2">
            <button
              className="border pl-4 pr-4 py-1.5 rounded-md bg-green-500"
              disabled={players.length < 5}
            >
              Start Room
            </button>
          </div>
        ) : (
          <p className="text-[1rem] mt-2">
            Waiting for the creator to start the room.
          </p>
        )}
      </div>
    </div>
  );
};

export default Room;
