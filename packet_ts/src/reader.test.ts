import { Reader } from "./reader";

type BufferType = "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "f32";
function make_buffer(type: BufferType, value: number) {
    let size = 0;
    switch (type) {
        case "u8": size = 1; break;
        case "u16": size = 2; break;
        case "u32": size = 4; break;
        case "i8": size = 1; break;
        case "i16": size = 2; break;
        case "i32": size = 4; break;
        case "f32": size = 4; break;
        default: throw new Error(`??????`);
    }
    const buffer = new ArrayBuffer(size);
    const view = new DataView(buffer);
    switch (type) {
        case "u8": view.setUint8(0, value); break;
        case "u16": view.setUint16(0, value, true); break;
        case "u32": view.setUint32(0, value, true); break;
        case "i8": view.setInt8(0, value); break;
        case "i16": view.setInt16(0, value, true); break;
        case "i32": view.setInt32(0, value, true); break;
        case "f32": view.setFloat32(0, value, true); break;
        default: throw new Error(`??????`);
    }
    return new Uint8Array(buffer);
}

type ReaderMethodKey = Exclude<keyof Reader, "read_slice">;

const cases: [string, Uint8Array, number][] = [
    ["uint8", make_buffer("u8", 100), 100],
    ["uint16", make_buffer("u16", 10000), 10000],
    ["uint32", make_buffer("u32", 1_000_000_000), 1_000_000_000],
    ["int8", make_buffer("u8", 100), 100],
    ["int16", make_buffer("u16", 10000), 10000],
    ["int32", make_buffer("u32", 1_000_000_000), 1_000_000_000],
    ["float", make_buffer("f32", 10.5), 10.5],
];
describe("Reader scalar", function () {
    for (const test_case of cases) {
        const [type, value, expected] = test_case;
        it(`read_${type}`, function () {
            const reader = new Reader(value.buffer);
            const actual = reader[`read_${type}` as ReaderMethodKey]();
            expect(actual).toEqual(expected);
        });
    }

    it(`read_slice`, function () {
        const value = new TextEncoder().encode("testing");
        const expected = "testing";
        const reader = new Reader(value.buffer);
        const actual = new TextDecoder().decode(reader.read_slice("testing".length));
        expect(actual).toEqual(expected);
    });
});