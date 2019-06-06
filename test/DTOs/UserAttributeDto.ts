import { MapProp } from "../../src/decorators/MapProp";

export class UserAttributeDto {
    @MapProp()
    public attribute: string;
}
