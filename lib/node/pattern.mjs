import { EstreeSentryTypeError } from "../error.mjs";
import { map } from "../util/index.mjs";
import {
  getBoolean,
  getFalse,
  getNullableObjectArray,
  getObject,
  getObjectArray,
  getRecord,
  getSingleton,
} from "../access.mjs";
import { guardExpression } from "./expression.mjs";
import { subguardVariableIdentifier } from "./identifier.mjs";
import { guardKey } from "./key.mjs";
import { joinDeepPath, joinPath } from "../path.mjs";
import { subguardMemberExpression } from "./member.mjs";
import { subguardCallExpression } from "./call.mjs";
import { subguardVariableDeclaration } from "./declaration.mjs";

/**
 * @type {{[key in import("./pattern").Pattern<{}>["type"]]: null}}
 */
export const PATTERN_TYPE_RECORD = {
  ArrayPattern: null,
  AssignmentPattern: null,
  ObjectPattern: null,
  Identifier: null,
  MemberExpression: null,
};

/**
 * @type {{[key in import("./pattern").RestablePattern<{}>["type"]]: null}}
 */
export const RESTABLE_PATTERN_TYPE_RECORD = {
  ...PATTERN_TYPE_RECORD,
  RestElement: null,
};

/**
 * @type {{[key in import("./pattern").RestablePatternProperty<{}>["type"]]: null}}
 */
export const RESTABLE_PATTERN_PROPERTY_TYPE_RECORD = {
  Property: null,
  RestElement: null,
};

/**
 * @type {{[key in import("./pattern").DeclarablePattern<{}>["type"]]: null}}
 */
export const DECLARABLE_PATTERN_TYPE_RECORD = {
  ...PATTERN_TYPE_RECORD,
  VariableDeclaration: null,
};

/**
 * @type {{[key in import("./pattern").CallablePattern<{}>["type"]]: null}}
 */
export const CALLABLE_PATTERN_TYPE_RECORD = {
  ...PATTERN_TYPE_RECORD,
  CallExpression: null,
};

/**
 * @type {{[key in import("./pattern").UpdatePattern<{}>["type"]]: null}}
 */
export const UPDATE_PATTERN_TYPE_RECORD = {
  Identifier: null,
  MemberExpression: null,
};

/**
 * @type {{[key in import("./pattern").CallableUpdatePattern<{}>["type"]]: null}}
 */
export const CALLABLE_UPDATE_PATTERN_TYPE_RECORD = {
  ...UPDATE_PATTERN_TYPE_RECORD,
  CallExpression: null,
};

/**
 * @type {import("../guard").Subguard<
 *   import("./pattern").RestElement<{}>
 * >}
 */
const subguardRestElement = (node, path, annotate, type, kind) => ({
  type,
  argument: guardPattern(
    getObject(node, "argument", path, kind),
    joinPath(path, "argument"),
    annotate,
  ),
  ...annotate(node, path, kind),
});

/**
 * @type {import("../guard").Guard<
 *   import("./pattern").RestablePatternProperty<{}>
 * >}
 */
const guardRestablePatternProperty = (node, path, annotate) => {
  const kind = "RestablePatternProperty";
  const type = getRecord(
    node,
    "type",
    path,
    kind,
    RESTABLE_PATTERN_PROPERTY_TYPE_RECORD,
  );
  switch (type) {
    case "Property": {
      const computed = getBoolean(node, "computed", path, kind);
      if (computed) {
        return {
          type,
          key: guardExpression(
            getObject(node, "key", path, kind),
            joinPath(path, "key"),
            annotate,
          ),
          value: guardPattern(
            getObject(node, "value", path, kind),
            joinPath(path, "value"),
            annotate,
          ),
          kind: getSingleton(node, "kind", path, kind, "init"),
          method: getFalse(node, "method", path, kind),
          shorthand: getFalse(node, "shorthand", path, kind),
          computed,
          ...annotate(node, path, kind),
        };
      } else {
        return {
          type,
          key: guardKey(
            getObject(node, "key", path, kind),
            joinPath(path, "key"),
            annotate,
          ),
          value: guardPattern(
            getObject(node, "value", path, kind),
            joinPath(path, "value"),
            annotate,
          ),
          kind: getSingleton(node, "kind", path, kind, "init"),
          method: getFalse(node, "method", path, kind),
          shorthand: getBoolean(node, "shorthand", path, kind),
          computed,
          ...annotate(node, path, kind),
        };
      }
    }
    case "RestElement": {
      return subguardRestElement(node, path, annotate, type, kind);
    }
    /* c8 ignore start */
    default: {
      throw new EstreeSentryTypeError(type);
    }
    /* c8 ignore stop */
  }
};

/**
 * @type {import("../guard").Subguard<
 *   import("./pattern").Pattern<{}>,
 * >}
 */
const subguardPattern = (node, path, annotate, type, kind) => {
  switch (type) {
    case "AssignmentPattern": {
      return {
        type,
        left: guardPattern(
          getObject(node, "left", path, kind),
          joinPath(path, "left"),
          annotate,
        ),
        right: guardExpression(
          getObject(node, "right", path, kind),
          joinPath(path, "right"),
          annotate,
        ),
        ...annotate(node, path, kind),
      };
    }
    case "Identifier": {
      return subguardVariableIdentifier(node, path, annotate, type, kind);
    }
    case "MemberExpression": {
      return subguardMemberExpression(node, path, annotate, type, kind);
    }
    case "ArrayPattern": {
      return {
        type,
        elements: map(
          getNullableObjectArray(node, "elements", path, kind),
          (item, index) =>
            item === null
              ? null
              : guardRestablePattern(
                  item,
                  joinDeepPath(path, "elements", index),
                  annotate,
                ),
        ),
        ...annotate(node, path, kind),
      };
    }
    case "ObjectPattern": {
      return {
        type,
        properties: map(
          getObjectArray(node, "properties", path, kind),
          (item, index) =>
            guardRestablePatternProperty(
              item,
              joinDeepPath(path, "properties", index),
              annotate,
            ),
        ),
        ...annotate(node, path, kind),
      };
    }
    /* c8 ignore start */
    default: {
      throw new EstreeSentryTypeError(type);
    }
    /* c8 ignore stop */
  }
};

/**
 * @type {import("../guard").Guard<
 *   import("./pattern").Pattern<{}>
 * >}
 */
export const guardPattern = (node, path, annotate) => {
  const kind = "Pattern";
  const type = getRecord(node, "type", path, kind, PATTERN_TYPE_RECORD);
  return subguardPattern(node, path, annotate, type, kind);
};

/**
 * @type {import("../guard").Guard<
 *   import("./pattern").RestablePattern<{}>
 * >}
 */
export const guardRestablePattern = (node, path, annotate) => {
  const kind = "RestablePattern";
  const type = getRecord(
    node,
    "type",
    path,
    kind,
    RESTABLE_PATTERN_TYPE_RECORD,
  );
  switch (type) {
    case "RestElement": {
      return subguardRestElement(node, path, annotate, type, kind);
    }
    default: {
      return subguardPattern(node, path, annotate, type, kind);
    }
  }
};

/**
 * @type {import("../guard").Guard<
 *   import("./pattern").UpdatePattern<{}>
 * >}
 */
export const guardUpdatePattern = (node, path, annotate) => {
  const kind = "UpdatePattern";
  const type = getRecord(node, "type", path, kind, UPDATE_PATTERN_TYPE_RECORD);
  switch (type) {
    case "Identifier": {
      return subguardVariableIdentifier(node, path, annotate, type, kind);
    }
    case "MemberExpression": {
      return subguardMemberExpression(node, path, annotate, type, kind);
    }
    /* c8 ignore start */
    default: {
      throw new EstreeSentryTypeError(type);
    }
    /* c8 ignore stop */
  }
};

/**
 * @type {import("../guard").Guard<
 *   import("./pattern").CallableUpdatePattern<{}>
 * >}
 */
export const guardCallableUpdatePattern = (node, path, annotate) => {
  const kind = "CallableUpdatePattern";
  const type = getRecord(
    node,
    "type",
    path,
    kind,
    CALLABLE_UPDATE_PATTERN_TYPE_RECORD,
  );
  switch (type) {
    case "Identifier": {
      return subguardVariableIdentifier(node, path, annotate, type, kind);
    }
    case "MemberExpression": {
      return subguardMemberExpression(node, path, annotate, type, kind);
    }
    case "CallExpression": {
      return subguardCallExpression(node, path, annotate, type, kind);
    }
    /* c8 ignore start */
    default: {
      throw new EstreeSentryTypeError(type);
    }
    /* c8 ignore stop */
  }
};

/**
 * @type {import("../guard").Guard<
 *   import("./pattern").DeclarablePattern<{}>
 * >}
 */
export const guardDeclarablePattern = (node, path, annotate) => {
  const kind = "DeclarablePattern";
  const type = getRecord(
    node,
    "type",
    path,
    kind,
    DECLARABLE_PATTERN_TYPE_RECORD,
  );
  switch (type) {
    case "VariableDeclaration": {
      return subguardVariableDeclaration(node, path, annotate, type, kind);
    }
    default: {
      return subguardPattern(node, path, annotate, type, kind);
    }
  }
};

/**
 * @type {import("../guard").Guard<
 *   import("./pattern").CallablePattern<{}>
 * >}
 */
export const guardCallablePattern = (node, path, annotate) => {
  const kind = "CallablePattern";
  const type = getRecord(
    node,
    "type",
    path,
    kind,
    CALLABLE_PATTERN_TYPE_RECORD,
  );
  switch (type) {
    case "CallExpression": {
      return subguardCallExpression(node, path, annotate, type, kind);
    }
    default: {
      return subguardPattern(node, path, annotate, type, kind);
    }
  }
};
