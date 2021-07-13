import { TransformFnParams, TransformationType } from 'class-transformer';

/**
 * If intended to transform undefined values, note that @Expose is required to force transformer to run
 * ie. Without @Expose, @Transform(transformFn) would not be called at all in case of "{}" => Class
 * Missing properties would always be `undefined`
 * class-transformer 0.4.0, Jun 07, 2021
 */
type TransformerSpec<Property, Value> = {
    toPlain: (property: Property) => Value;
    toClass: (value: Value) => Property;
    transformUndefined?: boolean;
};

export function toTwoWayTransformer<Property, Value>(
    transformerSpec: TransformerSpec<Property, Value>,
) {
    return function (params: TransformFnParams): Property | Value | undefined {
        if (!transformerSpec.transformUndefined && params.value === undefined) {
            return undefined;
        }
        switch (params.type) {
            case TransformationType.CLASS_TO_PLAIN:
                return transformerSpec.toPlain(params.value);
            case TransformationType.PLAIN_TO_CLASS:
                return transformerSpec.toClass(params.value);
            default:
                throw Error('Class to class transformation is not supported');
        }
    };
}
