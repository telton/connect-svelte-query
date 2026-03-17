import type { DescMethodUnary } from '@bufbuild/protobuf';

/**
 * A service with a method property
 */
export type ServiceLike = {
  method: Record<string, DescMethodUnary<any, any>>;
};

/**
 * Extract method names from a service
 */
export type MethodNames<S extends ServiceLike> = keyof S['method'] & string;

/**
 * Extract the method descriptor for a given method name
 */
export type GetMethod<S extends ServiceLike, M extends MethodNames<S>> = S['method'][M];
