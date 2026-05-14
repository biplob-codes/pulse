import UserAvatar from "./UserAvatar";
interface Props {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}
const UserBadge = ({ user }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={user} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {user.name}
        </p>

        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
    </div>
  );
};

export default UserBadge;
