# Node Play

A simple console application which bootstrap node js playground with typescript configs

Use cases

- Test validate and test node js libs
- Create & validate snippets

Help

`$ play-node --help`

```
Usage: play-node [options] [command]

Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  create [options]
  help [command]    display help for command
```

Example

`$ play-node create -t ts -n test`

```
.
├── commitlint.config.js
├── nodemon.json
├── package.json
├── package-lock.json
├── scopes.js
├── src
│   └── main.ts
└── tsconfig.json
```
