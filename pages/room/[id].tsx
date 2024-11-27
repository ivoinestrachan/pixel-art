import { useRouter } from "next/router";
import { FC } from "react";

const Room: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-[3rem] font-bold">{id}</h1>
      <p className="text-[1.5rem] mt-4">Invite others to join using the room code: {id}</p>
    </div>
  );
};

export default Room;
