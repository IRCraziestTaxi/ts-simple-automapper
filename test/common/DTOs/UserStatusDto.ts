import { MapProp } from "../../../src/decorators/MapProp";

export class UserStatusDto {
    @MapProp()
    public active: boolean;
}
