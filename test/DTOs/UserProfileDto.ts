import { MapFrom } from "../../src/decorators/MapFrom";
import { MapProp } from "../../src/decorators/MapProp";
import { UserProfile } from "../entities/UserProfile";

export class UserProfileDto {
    @MapProp()
    public email: string;

    @MapFrom(() => UserProfile, { mapFrom: up => `${up.firstName} ${up.lastName}` })
    public name: string;
}
