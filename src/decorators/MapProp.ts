import "reflect-metadata";

import { PropMappingRule } from "../interfaces/PropMappingRule";
import { SYMBOL_PROP_MAPPING_RULES } from "../constants/DecoratorConstants";

/**
 * Map to this property even if it has not been initialized on the target object.
 */
export const MapProp: () => PropertyDecorator
    = () => {
        return (target: Object, propKey: string | symbol) => {
            const classDef = target.constructor;

            let rules: PropMappingRule[] = Reflect.getMetadata(SYMBOL_PROP_MAPPING_RULES, classDef);

            if (!rules) {
                rules = [];
            }

            rules.push({
                propName: propKey.toString()
            });

            Reflect.defineMetadata(SYMBOL_PROP_MAPPING_RULES, rules, classDef);
        };
    };
