# mowojang-cli

![NPM Version](https://img.shields.io/npm/v/mowojang-cli?label=NPM)
![NPM Downloads](https://img.shields.io/npm/dm/mowojang-cli?label=Downloads)
![NPM License](https://img.shields.io/npm/l/mowojang-cli?label=License)

## Install

[`npm`](https://npmjs.com/) » `npm install -g mowojang-cli`<br/>
[`pnpm`](https://pnpm.io/) » `pnpm install -g mowojang-cli`<br/>
[`bun`](https://bun.sh/) » `bun install -g mowojang-cli`

## Usage

`mowojang help`
or
`mowojang-cli help`

```text
mowojang/mowojang-cli

Usage:
  mowojang <command> [args] [options]
  or
  mowojang-cli <command> [args] [options]

Commands:
  uuid <username>               Get the UUID for a username
  username <uuid>               Get the username for a UUID
  skin <player>                 Get skin metadata for a player
  cape <player>                 Get cape metadata for a player
  skin-buffer <player>          Output a player's skin image as base64 or save it to file
  cape-buffer <player>          Output a player's cape image as base64 or save it to file
  profile <player>              Get a player's profile
  profiles <player1> <player2>  Get multiple player profiles
  session <player>              Get session details
  sessions <player1> <player2>  Get multiple player sessions
  validate player <value>       Validate a username or UUID
  validate uuid <value>         Validate a UUID
  validate username <value>     Validate a username
  utils dash <uuid>             Convert a UUID to dashed form
  utils undash <uuid>           Convert a UUID to undashed form

Options:
  --debug                       Show debug messages
  --no-validate                 Disable input validation
  --base-url <url>              Use a custom API base URL
  --no-fallback                 Disable fallback to mowojang.seraph.si if mowojang.matdoes.dev is down
  --output <path>               Write buffer output to a file (only for skin-buffer/cape-buffer)
  -h, --help                    Show this help message
```
