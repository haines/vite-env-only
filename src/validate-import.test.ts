import { describe, expect, test } from "vitest"
import { validateImport } from "./validate-import"
import path from "path"

function fromCwd(relativePath: string) {
  return path.join(process.cwd(), relativePath)
}

describe("validateImport", () => {
  test("denyImports.client / env:client / failed string validation", () => {
    expect(() =>
      validateImport({
        id: "server-only",
        denyImports: {
          client: ["server-only"],
          server: [],
        },
        root: fromCwd("/"),
        importer: fromCwd("/path/to/importer.ts"),
        env: "client",
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [vite-env-only:denyImports] Import denied in client environment
       - Import: "server-only"
       - Importer: path/to/importer.ts
       - Pattern: "server-only"]
    `
    )
  })

  test("denyImports.client / env:client / failed regex validation", () => {
    expect(() =>
      validateImport({
        id: "../foo.server.ts",
        denyImports: {
          client: [/\.server/],
          server: [],
        },
        root: fromCwd("/"),
        importer: fromCwd("/path/to/importer.ts"),
        env: "client",
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [vite-env-only:denyImports] Import denied in client environment
       - Import: "../foo.server.ts"
       - Importer: path/to/importer.ts
       - Pattern: /\\.server/]
    `
    )
  })

  test("denyImports.client / env:client / passed validation", () => {
    expect(() =>
      validateImport({
        id: "some-other-module",
        denyImports: {
          client: ["server-only"],
          server: [],
        },
        root: fromCwd("/"),
        importer: fromCwd("/path/to/importer.ts"),
        env: "client",
      })
    ).not.toThrow()
  })

  test("denyImports.client / env:server / ignores denyImports.client", () => {
    expect(() =>
      validateImport({
        id: "server-only",
        denyImports: {
          client: ["server-only"],
          server: [],
        },
        root: fromCwd("/"),
        importer: fromCwd("/path/to/importer.ts"),
        env: "server",
      })
    ).not.toThrow()
  })

  test("denyImports.server / env:server / failed string validation", () => {
    expect(() =>
      validateImport({
        id: "client-only",
        denyImports: {
          client: [],
          server: ["client-only"],
        },
        root: fromCwd("/"),
        importer: fromCwd("/path/to/importer.ts"),
        env: "server",
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [vite-env-only:denyImports] Import denied in server environment
       - Import: "client-only"
       - Importer: path/to/importer.ts
       - Pattern: "client-only"]
    `
    )
  })

  test("denyImports.server / env:server / failed regex validation", () => {
    expect(() =>
      validateImport({
        id: "../foo.client.ts",
        denyImports: {
          client: [],
          server: [/\.client/],
        },
        root: fromCwd("/"),
        importer: fromCwd("/path/to/importer.ts"),
        env: "server",
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `
      [Error: [vite-env-only:denyImports] Import denied in server environment
       - Import: "../foo.client.ts"
       - Importer: path/to/importer.ts
       - Pattern: /\\.client/]
    `
    )
  })

  test("denyImports.server / env:server / passed validation", () => {
    expect(() =>
      validateImport({
        id: "some-other-module",
        denyImports: {
          client: [],
          server: ["client-only"],
        },
        root: fromCwd("/"),
        importer: fromCwd("/path/to/importer.ts"),
        env: "server",
      })
    ).not.toThrow()
  })

  test("denyImports.server / env:client / ignores denyImports.server", () => {
    expect(() =>
      validateImport({
        id: "client-only",
        denyImports: {
          client: [],
          server: ["client-only"],
        },
        root: fromCwd("/"),
        importer: fromCwd("/path/to/importer.ts"),
        env: "client",
      })
    ).not.toThrow()
  })
})
