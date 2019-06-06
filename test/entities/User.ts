import { Hide } from "../../src/decorators/Hide";
import { UserDto_OptionalMappingRelationships } from "../DTOs/UserDto_OptionalMappingRelationships";
import { UserAttribute } from "./UserAttribute";
import { UserProfile } from "./UserProfile";

export class User {
    public attributes: UserAttribute[];

    @Hide()
    public hideThisPropFromAll: string;

    @Hide(() => UserDto_OptionalMappingRelationships)
    public hideThisPropFromOne: string;

    public ignoreThisPropFromAll: string;

    public ignoreThisPropFromOne: string;

    public notMapped: string;

    public password: string;

    public profile: UserProfile;

    public username: string;

    public get getterTest(): boolean {
        return false;
    }

    public functionTest(): boolean {
        return false;
    }
}
