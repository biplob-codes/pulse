import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
interface Props {
  user: {
    name: string;
    image?: string | null;
  };
}
const UserAvatar = ({ user }: Props) => {
  return (
    <Avatar className="ml-1 h-8 w-8 cursor-pointer">
      <AvatarImage src={user.image || ""} alt={user.name} />
      <AvatarFallback className="text-xs bg-muted text-muted-foreground">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
