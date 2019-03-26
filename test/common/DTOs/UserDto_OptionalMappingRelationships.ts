import { Ignore } from "../../../src/decorators/Ignore";
import { MapFrom } from "../../../src/decorators/MapFrom";
import { User } from "../entities/User";
import { User_OptionalMappingRelationships } from "../entities/User_OptionalMappingRelationships";

// tslint:disable-next-line: class-name
export class UserDto_OptionalMappingRelationships {
    public hideThisPropFromAll: string;

    public hideThisPropFromOne: string;

    @Ignore()
    @MapFrom(() => User_OptionalMappingRelationships)
    public ignoreThisPropFromAll: string;

    @Ignore(() => User)
    public ignoreThisPropFromOne: string;
}
