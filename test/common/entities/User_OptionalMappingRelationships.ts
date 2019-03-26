import { UserProfile } from "./UserProfile";
import { Hide } from "../../../src/decorators/Hide";

// tslint:disable-next-line: class-name
export class User_OptionalMappingRelationships {
    @Hide()
    public hideThisPropFromAll: string;

    public hideThisPropFromOne: string;

    public ignoreThisPropFromAll: string;

    public ignoreThisPropFromOne: string;

    public password: string;

    public profile: UserProfile;

    public username: string;
}
