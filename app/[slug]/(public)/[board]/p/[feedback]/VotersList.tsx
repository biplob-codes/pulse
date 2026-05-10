import UserAvatar from "@/components/UserAvatar";

interface Props {
  voters: {
    id: string;
    name: string;
    image: string | null;
  }[];
}

export function VotersList({ voters }: Props) {
  return (
    <div className=" border border-border  rounded-sm p-5 w-9/10">
      <p className=" text-gray-500 text-sm font-semibold  mb-3">VOTERS</p>

      <div className="flex flex-col gap-2.5">
        {voters.map((voter) => (
          <div key={voter.id} className="flex items-center gap-2.5">
            <UserAvatar user={voter} />
            <span className="text-[15px] text-gray-800 dark:text-gray-200">
              {voter.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
