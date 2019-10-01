/* tslint:disable */
export const memory: WebAssembly.Memory;
export function init_panic_hook(): void;
export function __wbg_config_free(a: number): void;
export function __wbg_get_config_level(a: number): number;
export function __wbg_set_config_level(a: number, b: number): void;
export function __wbg_get_config_bench_space(a: number): number;
export function __wbg_set_config_bench_space(a: number, b: number): void;
export function __wbg_get_config_budget(a: number, b: number): void;
export function __wbg_set_config_budget(a: number, b: number, c: number): void;
export function config_new(a: number): number;
export function __wbg_evaluationmetric_free(a: number): void;
export function evaluationmetric_from_js(a: number): number;
export function __wbg_evaluator_free(a: number): void;
export function evaluator_new(a: number): number;
export function evaluator_run(a: number, b: number): number;
export function evaluator_size(a: number): number;
export function evaluator_evaluate(a: number, b: number, c: number): void;
export function __wbg_tier_free(a: number): void;
export function __wbg_get_tier_0(a: number): number;
export function __wbg_set_tier_0(a: number, b: number): void;
export function __wbg_championid_free(a: number): void;
export function __wbg_get_championid_0(a: number): number;
export function __wbg_set_championid_0(a: number, b: number): void;
export function __wbg_championdef_free(a: number): void;
export function __wbg_get_championdef_tier(a: number): number;
export function __wbg_set_championdef_tier(a: number, b: number): void;
export function __wbg_get_championdef_id(a: number): number;
export function __wbg_set_championdef_id(a: number, b: number): void;
export function __wbindgen_exn_store(a: number): void;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
export function __wbindgen_free(a: number, b: number): void;