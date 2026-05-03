export interface ToolSchema {
  type?: string;
  properties?: Record<string, ToolSchema>;
  required?: string[];
  items?: ToolSchema;
  enum?: unknown[];
}

export interface PrepareToolArgumentsOptions {
  toolName?: string;
  schema: Record<string, unknown>;
  defaults?: Record<string, unknown>;
  args: Record<string, unknown>;
}

export interface ToolArgumentPreparation {
  args: Record<string, unknown>;
  errors: string[];
  missingFields: string[];
  invalidFields: string[];
  hint?: string;
}

interface ValidationIssue {
  kind: "missing" | "invalid";
  path: string;
  message: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithDefaults(
  defaults: Record<string, unknown>,
  input: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...defaults };

  for (const [key, value] of Object.entries(input)) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = mergeWithDefaults(
        result[key] as Record<string, unknown>,
        value,
      );
      continue;
    }

    result[key] = value;
  }

  return result;
}

function coerceArgsToSchema(value: unknown, schema: ToolSchema | undefined): unknown {
  if (!schema) {
    return value;
  }

  if (schema.type === "array") {
    if (value === undefined || value === null) {
      return value;
    }

    if (!Array.isArray(value)) {
      return [value].map((item) => coerceArgsToSchema(item, schema.items));
    }

    return value.map((item) => coerceArgsToSchema(item, schema.items));
  }

  if (schema.type === "object" && isPlainObject(value)) {
    const properties = schema.properties ?? {};
    const result: Record<string, unknown> = { ...value };

    for (const [key, propertySchema] of Object.entries(properties)) {
      if (result[key] !== undefined) {
        result[key] = coerceArgsToSchema(result[key], propertySchema);
      }
    }

    return result;
  }

  return value;
}

function appendPath(path: string, segment: string): string {
  return path ? `${path}.${segment}` : segment;
}

function formatPath(path: string): string {
  return path ? `arguments.${path}` : "arguments";
}

export function buildValidationHint(
  toolName: string | undefined,
  missingFields: string[],
  invalidFields: string[],
): string | undefined {
  if (missingFields.length === 0 && invalidFields.length === 0) {
    return undefined;
  }

  const target = toolName ? `Retry ${toolName}` : "Retry the tool call";
  const parts = [`${target} with arguments that match the inputSchema.`];

  if (missingFields.length > 0) {
    parts.push(`Provide required fields: ${missingFields.join(", ")}.`);
  }

  if (invalidFields.length > 0) {
    parts.push(`Fix the value type or enum for: ${invalidFields.join(", ")}.`);
  }

  return parts.join(" ");
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function validateValue(
  value: unknown,
  schema: ToolSchema | undefined,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!schema) {
    return;
  }

  if (schema.enum && !schema.enum.some((option) => option === value)) {
    issues.push({
      kind: "invalid",
      path,
      message: `${formatPath(path)} must be one of: ${schema.enum.join(", ")}`,
    });
    return;
  }

  switch (schema.type) {
    case "string":
      if (typeof value !== "string") {
        issues.push({
          kind: "invalid",
          path,
          message: `${formatPath(path)} must be a string`,
        });
      }
      return;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) {
        issues.push({
          kind: "invalid",
          path,
          message: `${formatPath(path)} must be a finite number`,
        });
      }
      return;
    case "boolean":
      if (typeof value !== "boolean") {
        issues.push({
          kind: "invalid",
          path,
          message: `${formatPath(path)} must be a boolean`,
        });
      }
      return;
    case "array":
      if (!Array.isArray(value)) {
        issues.push({
          kind: "invalid",
          path,
          message: `${formatPath(path)} must be an array`,
        });
        return;
      }

      value.forEach((item, index) =>
        validateValue(item, schema.items, `${path}[${index}]`, issues),
      );
      return;
    case "object": {
      if (!isPlainObject(value)) {
        issues.push({
          kind: "invalid",
          path,
          message: `${formatPath(path)} must be an object`,
        });
        return;
      }

      const properties = schema.properties ?? {};
      const required = schema.required ?? [];

      for (const requiredKey of required) {
        if (value[requiredKey] === undefined) {
          const requiredPath = appendPath(path, requiredKey);
          issues.push({
            kind: "missing",
            path: requiredPath,
            message: `${formatPath(requiredPath)} is required`,
          });
        }
      }

      for (const [property, propertySchema] of Object.entries(properties)) {
        if (value[property] !== undefined) {
          validateValue(value[property], propertySchema, appendPath(path, property), issues);
        }
      }

      return;
    }
    default:
      return;
  }
}

export function prepareToolArguments({
  toolName,
  schema,
  defaults = {},
  args,
}: PrepareToolArgumentsOptions): ToolArgumentPreparation {
  const mergedArgs = coerceArgsToSchema(
    mergeWithDefaults(defaults, args),
    schema as ToolSchema,
  ) as Record<string, unknown>;
  const issues: ValidationIssue[] = [];

  validateValue(mergedArgs, schema as ToolSchema, "", issues);

  const missingFields = unique(
    issues.filter((issue) => issue.kind === "missing").map((issue) => issue.path),
  );
  const invalidFields = unique(
    issues.filter((issue) => issue.kind === "invalid").map((issue) => issue.path),
  );

  return {
    args: mergedArgs,
    errors: issues.map((issue) => issue.message),
    missingFields,
    invalidFields,
    hint: buildValidationHint(toolName, missingFields, invalidFields),
  };
}
