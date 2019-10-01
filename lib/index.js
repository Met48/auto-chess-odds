
let wasm;

/**
*/
export function init_panic_hook() {
    wasm.init_panic_hook();
}

let cachegetInt32Memory = null;
function getInt32Memory() {
    if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachegetFloat32Memory = null;
function getFloat32Memory() {
    if (cachegetFloat32Memory === null || cachegetFloat32Memory.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory;
}

function getArrayF32FromWasm(ptr, len) {
    return getFloat32Memory().subarray(ptr / 4, ptr / 4 + len);
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function passStringToWasm(arg) {

    let len = arg.length;
    let ptr = wasm.__wbindgen_malloc(len);

    const mem = getUint8Memory();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = wasm.__wbindgen_realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function getArrayU8FromWasm(ptr, len) {
    return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
}

function handleError(e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
}
/**
*/
export class ChampionDef {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_championdef_free(ptr);
    }
    /**
    * @returns {Tier}
    */
    get tier() {
        const ret = wasm.__wbg_get_championdef_tier(this.ptr);
        return Tier.__wrap(ret);
    }
    /**
    * @param {Tier} arg0
    */
    set tier(arg0) {
        _assertClass(arg0, Tier);
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_championdef_tier(this.ptr, ptr0);
    }
    /**
    * @returns {ChampionId}
    */
    get id() {
        const ret = wasm.__wbg_get_championdef_id(this.ptr);
        return ChampionId.__wrap(ret);
    }
    /**
    * @param {ChampionId} arg0
    */
    set id(arg0) {
        _assertClass(arg0, ChampionId);
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_championdef_id(this.ptr, ptr0);
    }
}
/**
*/
export class ChampionId {

    static __wrap(ptr) {
        const obj = Object.create(ChampionId.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_championid_free(ptr);
    }
    /**
    * @returns {number}
    */
    get 0() {
        const ret = wasm.__wbg_get_championid_0(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set 0(arg0) {
        wasm.__wbg_set_championid_0(this.ptr, arg0);
    }
}
/**
*/
export class Config {

    static __wrap(ptr) {
        const obj = Object.create(Config.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_config_free(ptr);
    }
    /**
    * The player level.
    *
    * This affects the odds of various tiers appearing in the shop.
    * @returns {number}
    */
    get level() {
        const ret = wasm.__wbg_get_config_level(this.ptr);
        return ret;
    }
    /**
    * The player level.
    *
    * This affects the odds of various tiers appearing in the shop.
    * @param {number} arg0
    */
    set level(arg0) {
        wasm.__wbg_set_config_level(this.ptr, arg0);
    }
    /**
    * How many open spaces are on the bench.
    *
    * These will be filled with other champions of the target tier,
    * to improve the odds that the target champion is found.
    *
    * The target champion also takes up bench space, although it\'s assumed
    * that one copy will be on the field instead.
    * @returns {number}
    */
    get bench_space() {
        const ret = wasm.__wbg_get_config_bench_space(this.ptr);
        return ret >>> 0;
    }
    /**
    * How many open spaces are on the bench.
    *
    * These will be filled with other champions of the target tier,
    * to improve the odds that the target champion is found.
    *
    * The target champion also takes up bench space, although it\'s assumed
    * that one copy will be on the field instead.
    * @param {number} arg0
    */
    set bench_space(arg0) {
        wasm.__wbg_set_config_bench_space(this.ptr, arg0);
    }
    /**
    * How much gold is available to spend.
    *
    * If set, the budget will be considered for unit purchases (even for bench) and rerolls.
    * If None, it\'s assumed the budget is infinite.
    * @returns {number}
    */
    get budget() {
        const retptr = 8;
        const ret = wasm.__wbg_get_config_budget(retptr, this.ptr);
        const memi32 = getInt32Memory();
        return memi32[retptr / 4 + 0] === 0 ? undefined : memi32[retptr / 4 + 1] >>> 0;
    }
    /**
    * How much gold is available to spend.
    *
    * If set, the budget will be considered for unit purchases (even for bench) and rerolls.
    * If None, it\'s assumed the budget is infinite.
    * @param {number | undefined} arg0
    */
    set budget(arg0) {
        wasm.__wbg_set_config_budget(this.ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
    * @param {any} val
    * @returns {Config}
    */
    constructor(val) {
        try {
            const ret = wasm.config_new(addBorrowedObject(val));
            return Config.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class EvaluationMetric {

    static __wrap(ptr) {
        const obj = Object.create(EvaluationMetric.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_evaluationmetric_free(ptr);
    }
    /**
    * @param {any} val
    * @returns {EvaluationMetric}
    */
    constructor(val) {
        try {
            const ret = wasm.evaluationmetric_from_js(addBorrowedObject(val));
            return EvaluationMetric.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class Evaluator {

    static __wrap(ptr) {
        const obj = Object.create(Evaluator.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_evaluator_free(ptr);
    }
    /**
    * @param {Config} config
    * @returns {Evaluator}
    */
    constructor(config) {
        _assertClass(config, Config);
        const ret = wasm.evaluator_new(config.ptr);
        return Evaluator.__wrap(ret);
    }
    /**
    * @param {number} steps
    * @returns {boolean}
    */
    run(steps) {
        const ret = wasm.evaluator_run(this.ptr, steps);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    size() {
        const ret = wasm.evaluator_size(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {EvaluationMetric} metric
    * @returns {Float32Array}
    */
    evaluate(metric) {
        const retptr = 8;
        _assertClass(metric, EvaluationMetric);
        const ret = wasm.evaluator_evaluate(retptr, this.ptr, metric.ptr);
        const memi32 = getInt32Memory();
        const v0 = getArrayF32FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 4);
        return v0;
    }
}
/**
* The Tier of champion.
* Value must be 1 - 5 inclusive.
*/
export class Tier {

    static __wrap(ptr) {
        const obj = Object.create(Tier.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_tier_free(ptr);
    }
    /**
    * @returns {number}
    */
    get 0() {
        const ret = wasm.__wbg_get_tier_0(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set 0(arg0) {
        wasm.__wbg_set_tier_0(this.ptr, arg0);
    }
}

function init(module) {
    if (typeof module === 'undefined') {
        module = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    let result;
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = JSON.stringify(obj === undefined ? null : obj);
        const ret0 = passStringToWasm(ret);
        const ret1 = WASM_VECTOR_LEN;
        getInt32Memory()[arg0 / 4 + 0] = ret0;
        getInt32Memory()[arg0 / 4 + 1] = ret1;
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ret0 = passStringToWasm(ret);
        const ret1 = WASM_VECTOR_LEN;
        getInt32Memory()[arg0 / 4 + 0] = ret0;
        getInt32Memory()[arg0 / 4 + 1] = ret1;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        const v0 = getStringFromWasm(arg0, arg1).slice();
        wasm.__wbindgen_free(arg0, arg1 * 1);
        console.error(v0);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_randomFillSync_eae3007264ffc138 = function(arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm(arg1, arg2));
    };
    imports.wbg.__wbg_getRandomValues_f724b5822126eff7 = function(arg0, arg1, arg2) {
        getObject(arg0).getRandomValues(getArrayU8FromWasm(arg1, arg2));
    };
    imports.wbg.__wbg_self_1801c027cb0e6124 = function() {
        try {
            const ret = self.self;
            return addHeapObject(ret);
        } catch (e) {
            handleError(e)
        }
    };
    imports.wbg.__wbg_require_e89d842e759f0a4c = function(arg0, arg1) {
        const ret = require(getStringFromWasm(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_3e91f24788b1203d = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_getRandomValues_7ecea3ecacbb2f9e = function(arg0) {
        const ret = getObject(arg0).getRandomValues;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm(arg0, arg1));
    };

    if ((typeof URL === 'function' && module instanceof URL) || typeof module === 'string' || (typeof Request === 'function' && module instanceof Request)) {

        const response = fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                return response
                .then(r => {
                    if (r.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                        return r.arrayBuffer();
                    } else {
                        throw e;
                    }
                })
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module, imports)
        .then(result => {
            if (result instanceof WebAssembly.Instance) {
                return { instance: result, module };
            } else {
                return result;
            }
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    });
}

export default init;

