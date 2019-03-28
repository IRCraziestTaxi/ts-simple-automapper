import "reflect-metadata";

import { SYMBOL_PROP_MAPPING_RULES } from "../constants/DecoratorConstants";
import { PropMappingRule } from "../interfaces/PropMappingRule";
import { ClassType } from "../types/ClassType";

/**
 * Skips mapping this property to the destination object.
 * @param destinationTypeProvider If provided, skip mapping to this destination type only.
 */
export const Hide: <TDestination>(destinationTypeProvider?: () => ClassType<TDestination>) => PropertyDecorator =
    <TDestination>(destinationTypeProvider: () => ClassType<TDestination> = null) => {
        return (target: Object, propKey: string | symbol) => {
            const classDef = target.constructor;

            let rules: PropMappingRule[] = Reflect.getMetadata(SYMBOL_PROP_MAPPING_RULES, classDef);

            if (!rules) {
                rules = [];
            }

            rules.push({
                destinationTypeProvider,
                hide: true,
                propName: propKey.toString()
            });

            Reflect.defineMetadata(SYMBOL_PROP_MAPPING_RULES, rules, classDef);
        };
    };
