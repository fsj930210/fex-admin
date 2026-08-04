import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const workspaceRoot = process.cwd()
const angularPackagePath = path.join(workspaceRoot, 'packages/@fex-design/angular/package.json')
const corePackagePath = path.join(workspaceRoot, 'packages/@fex-design/core/package.json')
const outputPath = path.join(workspaceRoot, 'tsconfig.angular-workspace.json')

const angularPackage = JSON.parse(await readFile(angularPackagePath, 'utf8'))
const corePackage = JSON.parse(await readFile(corePackagePath, 'utf8'))
const componentPaths = Object.fromEntries(
  Object.entries(angularPackage.exports)
    .filter(([subpath, target]) => subpath.startsWith('./') && target.endsWith('.ts'))
    .map(([subpath, target]) => [
      `@fex-design/angular/${subpath.slice(2)}`,
      [path.posix.join('packages/@fex-design/angular', target.slice(2))],
    ]),
)
const corePaths = Object.fromEntries(
  Object.entries(corePackage.exports)
    .filter(([subpath, target]) => subpath.startsWith('./') && target.endsWith('.ts'))
    .map(([subpath, target]) => [
      subpath === '.' ? '@fex-design/core' : `@fex-design/core/${subpath.slice(2)}`,
      [path.posix.join('packages/@fex-design/core', target.slice(2))],
    ]),
)

const tsconfig = {
  extends: '@fex/config-tsconfig/angular-app.json',
  compilerOptions: {
    baseUrl: '.',
    ignoreDeprecations: '6.0',
    paths: { ...corePaths, ...componentPaths },
  },
}

await writeFile(outputPath, `${JSON.stringify(tsconfig, null, 2)}\n`)
