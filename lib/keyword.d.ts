export type Keyword =
  | "break"
  | "case"
  | "catch"
  | "class"
  | "const"
  | "continue"
  | "debugger"
  | "default"
  | "delete"
  | "do"
  | "else"
  | "enum"
  | "export"
  | "extends"
  | "false"
  | "finally"
  | "for"
  | "function"
  | "if"
  | "import"
  | "in"
  | "instanceof"
  | "new"
  | "null"
  | "return"
  | "super"
  | "switch"
  | "this"
  | "throw"
  | "true"
  | "try"
  | "typeof"
  | "var"
  | "void"
  | "while"
  | "with";

export type StrictKeyword =
  | "implements"
  | "interface"
  | "let"
  | "package"
  | "private"
  | "protected"
  | "public"
  | "static"
  | "yield";

export type StrictReadonlyKeyword = "arguments" | "eval";

export type ContextualKeyword = "await" | "yield";
