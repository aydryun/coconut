import { StringRecordId } from "surrealdb";

function convertToRecordArray(list: Array<string>): Array<StringRecordId> {
  const result: Array<StringRecordId> = list.map(
    (record: string) => new StringRecordId(record),
  );
  console.log(result);

  return result;
}

function convertRecordToId(record: string) {
  return record.split(":")[1];
}

function ConvertStringRecordToId(StringRecordId: StringRecordId | undefined) {
  console.log(StringRecordId);
}

export { convertToRecordArray, convertRecordToId, ConvertStringRecordToId };
