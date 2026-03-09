export type SurrealResponse<T> = T[][] | T[];

// Example usage:
// let numbers: SurrealResponse<number> = [[1, 2], [3, 4]];
// let strings: SurrealResponse<string> = [['a', 'b'], ['c', 'd']];

// const surrealResponse = { time: 'd"2023-07-03T07:18:52Z"' };
// const parsedDatetime = new Date(surrealResponse.time.slice(2, -1)); // Remove the `d"` prefix and trailing `"`
// console.log('Parsed datetime:', parsedDatetime);
