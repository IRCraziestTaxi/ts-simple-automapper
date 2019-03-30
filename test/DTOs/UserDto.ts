import { Ignore } from "../../src/decorators/Ignore";
import { MapFrom } from "../../src/decorators/MapFrom";
import { MapProp } from "../../src/decorators/MapProp";
import { User } from "../entities/User";
import { UserProfileDto } from "./UserProfileDto";
import { UserStatusDto } from "./UserStatusDto";

export class UserDto {
    @MapProp()
    public hideThisPropFromAll: string;

    @MapProp()
    public hideThisPropFromOne: string;

    @Ignore()
    public ignoreThisPropFromAll: string;

    @MapProp()
    public ignoreThisPropFromOne: string;

    public notMapped: string;

    @MapFrom(() => User, { destinationValueTypeProvider: () => UserProfileDto })
    public profile: UserProfileDto;

    @MapFrom(() => User, {
        destinationValueTypeProvider: () => UserStatusDto,
        mapFrom: u => u.profile.status
    })
    public status: UserStatusDto;

    @MapProp()
    public username: string;

    public get getterTest(): boolean {
        return true;
    }

    public functionTest(): boolean {
        return true;
    }
}
