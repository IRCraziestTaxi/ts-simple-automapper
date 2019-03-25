import { SYMBOL_PROP_MAPPING_RULES } from "../constants/DecoratorConstants";
import { PropMappingRule } from "../interfaces/PropMappingRule";
import { ClassType } from "../types/ClassType";

/**
 * Skips mapping this property from the source object.
 * @param sourceTypeProvider If provided, skip mapping from this source type only.
 */
export const Ignore: <TSource>(sourceTypeProvider?: () => ClassType<TSource>) => PropertyDecorator =
    <TSource>(sourceTypeProvider: () => ClassType<TSource> = null) => {
        return (target: Object, propKey: string | symbol) => {
            const classDef = target.constructor;

            let rules: PropMappingRule[] = Reflect.getMetadata(SYMBOL_PROP_MAPPING_RULES, classDef);

            if (!rules) {
                rules = [];
            }

            rules.push({
                ignore: true,
                propName: propKey.toString(),
                sourceTypeProvider
            });

            Reflect.defineMetadata(SYMBOL_PROP_MAPPING_RULES, rules, classDef);
        };
    };
