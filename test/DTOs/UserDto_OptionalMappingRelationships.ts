import { Ignore } from "../../src/decorators/Ignore";
import { MapFrom } from "../../src/decorators/MapFrom";
import { MapProp } from "../../src/decorators/MapProp";
import { User } from "../entities/User";
import { User_OptionalMappingRelationships } from "../entities/User_OptionalMappingRelationships";

// tslint:disable-next-line: class-name
export class UserDto_OptionalMappingRelationships {
    @MapProp()
    public hideThisPropFromAll: string;

    @MapProp()
    public hideThisPropFromOne: string;

    @Ignore()
    @MapFrom(() => User_OptionalMappingRelationships)
    public ignoreThisPropFromAll: string;

    @Ignore(() => User)
    public ignoreThisPropFromOne: string;
}
