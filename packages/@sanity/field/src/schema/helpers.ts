import {ArraySchemaType, Diff, KeyedObject, SchemaType, TypedObject} from '../diff'

export function resolveTypeName(value: unknown) {
  return isTypedObject(value) ? value._type : resolveJSType(value)
}

export function getArrayDiffItemType(diff: Diff, schemaType: ArraySchemaType) {
  if (diff.action === 'added') {
    return {
      toType: resolveArrayMemberType(schemaType, diff.toValue)
    }
  }

  if (diff.action === 'changed') {
    return {
      fromType: resolveArrayMemberType(schemaType, diff.fromValue),
      toType: resolveArrayMemberType(schemaType, diff.toValue)
    }
  }

  if (diff.action === 'removed') {
    return {
      fromType: resolveArrayMemberType(schemaType, diff.fromValue)
    }
  }

  // unchanged
  return {
    toType: resolveArrayMemberType(schemaType, diff.toValue)
  }
}

function resolveArrayMemberType(
  schemaType: ArraySchemaType,
  value: unknown
): SchemaType | undefined {
  const typeName = resolveTypeName(value)
  const declared = schemaType.of.find(candidate => candidate.name === typeName)
  if (declared) {
    return declared
  }

  return schemaType.of.length === 1 ? schemaType.of[0] : undefined
}

function isTypedObject(val: unknown): val is TypedObject {
  return typeof val === 'object' && val !== null && typeof (val as TypedObject)._type === 'string'
}

function isKeyedObject(val: unknown): val is KeyedObject {
  return typeof val === 'object' && val !== null && typeof (val as KeyedObject)._key === 'string'
}

function resolveJSType(val: unknown) {
  if (Array.isArray(val)) {
    return 'array'
  }

  if (val === null) {
    return 'null'
  }

  return typeof val
}