import { SYMBOL_PROP_MAPPING_RULES } from "../constants/DecoratorConstants";
import { MapFromOptions } from "../interfaces/MapFromOptions";
import { PropMappingRule } from "../interfaces/PropMappingRule";
import { ClassType } from "../types/ClassType";

/**
 * Specifies to map values from the specified source type using the specified options.
 * @param sourceTypeProvider The source type from which to apply this rule.
 * @param options Options for mapping the value from the source type to the destination.
 */
export const MapFrom: <TSource>(
    sourceTypeProvider: () => ClassType<TSource>,
    options?: MapFromOptions<TSource>
) => PropertyDecorator =
    <TSource>(
        sourceTypeProvider: () => ClassType<TSource>,
        options: MapFromOptions<TSource> = null
    ) => {
        return (target: Object, propKey: string | symbol) => {
            const classDef = target.constructor;

            let rules: PropMappingRule[] = Reflect.getMetadata(SYMBOL_PROP_MAPPING_RULES, classDef);

            if (!rules) {
                rules = [];
            }

            rules.push({
                mapFromOptions: options,
                propName: propKey.toString(),
                sourceTypeProvider
            });

            Reflect.defineMetadata(SYMBOL_PROP_MAPPING_RULES, rules, classDef);
        };
    };
