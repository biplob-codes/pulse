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
        {user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
