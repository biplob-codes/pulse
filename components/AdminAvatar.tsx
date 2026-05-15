import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
interface Props {
  user: {
    name: string;
    image?: string | null;
  };
}
const AdminAvatar = ({ user }: Props) => {
  return (
    <div className="relative w-fit">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image || ""} alt={user.name} />
        <AvatarFallback className="text-xs">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <span className="absolute -right-1 -bottom-1 rounded-full bg-indigo-500 p-0.75">
        <StarIcon className="size-2.5 fill-white text-white" stroke="2" />
      </span>
    </div>
  );
};

export default AdminAvatar;
