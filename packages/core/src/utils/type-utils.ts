export type RecordValues<T extends Record<any, any>> = T[keyof T]

export type ReplaceRecordType<T, From, To> = {
  [K in keyof T]: T[K] extends From ? To : T[K]
}
export type IsEmptyObject<Obj> =
  [keyof Obj] extends [never] ? true : false

export type ExcludeKeysWithTypeOf<T, V> = {
  [K in keyof T]-?: Exclude<T[K], undefined> extends V ? never : K;
}[keyof T];

export type ExcludeByType<T, V> = Pick<T, ExcludeKeysWithTypeOf<T, V>>;

export type PickByType<Record, Type> = Pick<Record, RecordValues<{
  [Key in keyof Record]: [Record[Key]] extends [Type] ? Key : never
}>>

export type UpperCaseCharacter =
  'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';
export type LowercaseCharacter = Lowercase<UpperCaseCharacter>;
export type Character = UpperCaseCharacter | LowercaseCharacter
