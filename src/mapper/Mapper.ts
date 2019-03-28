import "reflect-metadata";

import { SYMBOL_PROP_MAPPING_RULES } from "../constants/DecoratorConstants";
import { MapFromOptions } from "../interfaces/MapFromOptions";
import { PropMappingRule } from "../interfaces/PropMappingRule";
import { ClassType } from "../types/ClassType";

type Indexable = { [key: string]: any; };

export class Mapper {
    public map<TSource extends Indexable, TDestination extends Indexable>(
        source: TSource,
        destination: TDestination
    ): TDestination {
        if (!source || !destination) {
            return null;
        }

        // Start with metadata to get rules and keys for properties that are not defined.
        let destinationRules: PropMappingRule[] =
            Reflect.getMetadata(SYMBOL_PROP_MAPPING_RULES, (destination as Object).constructor);

        if (!destinationRules) {
            destinationRules = [];
        }

        // Add properties on the destination object that are not defined in metadata.
        for (const destinationKey of Object.keys(destination)) {
            // TODO: Needed?
            // if (!destination.hasOwnProperty(propKey)) {
            //     continue;
            // }

            // If property is already in our rules, skip it.
            const ruleIndex = destinationRules.findIndex(r => r.propName === destinationKey);

            if (ruleIndex >= 0) {
                continue;
            }

            // If a function, ignore.
            // TODO

            destinationRules.push({
                propName: destinationKey
            });
        }

        // If no properties exist to be mapped, return.
        if (!destinationRules.length) {
            return destination;
        }

        // Get source rules as well.
        let sourceRules: PropMappingRule[] =
            Reflect.getMetadata(SYMBOL_PROP_MAPPING_RULES, (source as Object).constructor);

        if (!sourceRules) {
            sourceRules = [];
        }

        // Get list of props to map from our new list of destination rules.
        // More than one rule may have been defined for a destination property.
        // Do not duplicate keys in the list of keys to iterate.
        const destinationKeys: string[] = [];

        for (const destinationRule of destinationRules) {
            if (destinationKeys.indexOf(destinationRule.propName) === -1) {
                destinationKeys.push(destinationRule.propName);
            }
        }

        for (const destinationKey of destinationKeys) {
            // TODO: Needed?
            // if (!destination.hasOwnProperty(destinationKey)) {
            //     continue;
            // }

            // Check if ignored for this source type specifically.
            const propIgnoredForSourceType = destinationRules.findIndex(r =>
                r.propName === destinationKey
                && r.ignore
                && !!r.sourceTypeProvider
                && r.sourceTypeProvider().prototype === (source as Object).constructor.prototype
            ) >= 0;

            // If ignored for this source type, skip.
            if (propIgnoredForSourceType) {
                continue;
            }

            // Check if ignored in general.
            const propIgnored = destinationRules.findIndex(r =>
                r.propName === destinationKey
                && r.ignore
                && !r.sourceTypeProvider
            ) >= 0;
            // Check if mapped for this source type. Save the index to use the rule later if needed.
            const mappingRuleIndex = destinationRules.findIndex(r =>
                r.propName === destinationKey
                && !r.ignore
                && !!r.sourceTypeProvider
                && r.sourceTypeProvider().prototype === (source as Object).constructor.prototype
            );

            // If ignored, skip.
            // However, if overridden to be mapped for this source type, do not skip.
            if (propIgnored && mappingRuleIndex === -1) {
                continue;
            }

            // Check if property is hidden by source type.
            const hidden = sourceRules.findIndex(r =>
                r.propName === destinationKey
                && r.hide
                && (
                    !r.destinationTypeProvider
                    || r.destinationTypeProvider().prototype === (destination as Object).constructor.prototype
                )
            ) >= 0;

            // If hidden in general or from this destination type, skip.
            if (hidden) {
                continue;
            }

            // Now we can map the property.
            // First, see if there are custom mapping options.
            let mappingOptions: MapFromOptions<TSource> = null;

            if (mappingRuleIndex >= 0) {
                mappingOptions = destinationRules[mappingRuleIndex].mapFromOptions;
            }

            let mappedValue: any = source[destinationKey];

            if (mappingOptions) {
                if (mappingOptions.mapFrom) {
                    mappedValue = mappingOptions.mapFrom(source);
                }

                // If a destinationValueTypeProvider was specified,
                // then the source and destination types are both class instances
                // and the destination should be mapped accordingly.
                if (mappingOptions.destinationValueTypeProvider) {
                    const mapTo = new (mappingOptions.destinationValueTypeProvider() as { new(): any; })();
                    mappedValue = this.map(mappedValue, mapTo);
                }
            }

            destination[destinationKey] = mappedValue;
        }

        return destination;
    }

    public mapList<TSource, TDestination>(
        sourceList: TSource[],
        destinationType: ClassType<TDestination>
    ): TDestination[] {
        if (!(sourceList instanceof Array)) {
            return [];
        }

        return sourceList.map(s => this.map(s, new destinationType()));
    }
}
