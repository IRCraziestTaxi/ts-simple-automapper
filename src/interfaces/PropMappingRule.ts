import { MapFromOptions } from "./MapFromOptions";

export interface PropMappingRule {
    hide?: boolean;
    ignore?: boolean;
    mapFromOptions?: MapFromOptions<any>;
    propName: string;
    destinationTypeProvider?(): Function;
    sourceTypeProvider?(): Function;
}
