export interface MapFromOptions<TSource> {
    destinationValueTypeProvider?(): Function;
    mapFrom?(src: TSource): any;
}
