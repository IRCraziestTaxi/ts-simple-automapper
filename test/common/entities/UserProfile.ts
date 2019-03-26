import { User } from "./User";
import { UserStatus } from "./UserStatus";

export class UserProfile {
    public email: string;

    public firstName: string;

    public lastName: string;

    public status: UserStatus;

    public user: User;
}
