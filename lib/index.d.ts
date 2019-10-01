/* tslint:disable */
/**
*/
export function init_panic_hook(): void;
/**
*/
export class ChampionDef {
  free(): void;
  id: ChampionId;
  tier: Tier;
}
/**
*/
export class ChampionId {
  free(): void;
  0: number;
}
/**
*/
export class Config {
  free(): void;
/**
* @param {any} val 
* @returns {Config} 
*/
  constructor(val: any);
  bench_space: number;
  budget: number;
  level: number;
}
/**
*/
export class EvaluationMetric {
  free(): void;
/**
* @param {any} val 
* @returns {EvaluationMetric} 
*/
  constructor(val: any);
}
/**
*/
export class Evaluator {
  free(): void;
/**
* @param {Config} config 
* @returns {Evaluator} 
*/
  constructor(config: Config);
/**
* @param {number} steps 
* @returns {boolean} 
*/
  run(steps: number): boolean;
/**
* @returns {number} 
*/
  size(): number;
/**
* @param {EvaluationMetric} metric 
* @returns {Float32Array} 
*/
  evaluate(metric: EvaluationMetric): Float32Array;
}
/**
* The Tier of champion.
* Value must be 1 - 5 inclusive.
*/
export class Tier {
  free(): void;
  0: number;
}

/**
* If `module_or_path` is {RequestInfo}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
*
* @returns {Promise<any>}
*/
export default function init (module_or_path?: RequestInfo | BufferSource | WebAssembly.Module): Promise<any>;
        