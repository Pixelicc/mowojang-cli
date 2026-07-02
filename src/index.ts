import fs from "fs";
import path from "path";
import { Client, validate, utils } from "mowojang";

type Options = {
  debug: boolean;
  validate: boolean;
  baseUrl?: string;
  fallback: boolean;
  output?: string;
  args: string[];
};

const help = `mowojang/mowojang-cli

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
`;

const parseArgs = (argv: string[]): Options => {
  const options: Options = {
    debug: false,
    validate: true,
    baseUrl: undefined,
    fallback: true,
    output: undefined,
    args: [],
  };

  for (let i = 0; i < argv.length; i += 1) {
    switch (argv[i]) {
      case "--debug":
        options.debug = true;
        break;
      case "--no-validate":
        options.validate = false;
        break;
      case "--no-fallback":
        options.fallback = false;
        break;
      case "--base-url":
        options.baseUrl = argv[++i];
        break;
      case "--output":
        options.output = argv[++i];
        break;
      case "-h":
      case "--help":
        options.args.push("help");
        break;
      default:
        options.args.push(argv[i]);
        break;
    }
  }
  return options;
};

const print = (text: string | null): void => {
  process.stdout.write(`${text}\n`);
};

const printJson = (value: unknown): void => {
  print(JSON.stringify(value, null, 2));
};

const writeBuffer = (buffer: Buffer, outputPath?: string): void => {
  if (outputPath) {
    fs.writeFileSync(path.resolve(process.cwd(), outputPath), buffer);
    console.log(`Saved to ${path.resolve(process.cwd(), outputPath)}`);
  } else {
    console.log(buffer.toString("base64"));
  }
};

const { args, debug, validate: enableValidation, baseUrl, fallback, output } = parseArgs(process.argv.slice(2));

if (args.length === 0 || args[0] === "help") {
  print(help);
  process.exit(0);
}

const [command, ...arg] = args;
const client = new Client({
  logger: {
    minLevel: debug ? "DEBUG" : undefined,
  },
  validation: { enabled: enableValidation },
  baseURL: baseUrl,
  fallback,
});

try {
  switch (command) {
    case "uuid": {
      const [username] = arg;
      if (!username) throw new Error("Usage: uuid <username>");
      print(await client.getUUID(username));
      break;
    }
    case "username": {
      const [uuid] = arg;
      if (!uuid) throw new Error("Usage: username <uuid>");
      print(await client.getUsername(uuid));
      break;
    }
    case "skin": {
      const [player] = arg;
      if (!player) throw new Error("Usage: skin <player>");
      const data = await client.getSkin(player);
      if (data) {
        printJson(data);
      } else {
        print(null);
      }
      break;
    }
    case "cape": {
      const [player] = arg;
      if (!player) throw new Error("Usage: cape <player>");
      const data = await client.getCape(player);
      if (data) {
        printJson(data);
      } else {
        print(null);
      }
      break;
    }
    case "skin-buffer": {
      const [player] = arg;
      if (!player) throw new Error("Usage: skin-buffer <player>");
      const data = await client.getSkinBuffer(player);
      if (data) {
        writeBuffer(data, output);
      } else {
        print(null);
      }
      break;
    }
    case "cape-buffer": {
      const [player] = arg;
      if (!player) throw new Error("Usage: cape-buffer <player>");
      const data = await client.getCapeBuffer(player);
      if (data) {
        writeBuffer(data, output);
      } else {
        print(null);
      }
      break;
    }
    case "profile": {
      const [player] = arg;
      if (!player) throw new Error("Usage: profile <player>");
      const result = await client.getProfile(player);
      if (result.error) throw new Error(result.error);
      printJson(result.data);
      break;
    }
    case "profiles": {
      if (arg.length === 0) throw new Error("Usage: profiles <player1> <player2> <player3>");
      const result = await client.getProfiles(arg);
      if (result.error) throw new Error(result.error);
      printJson(result.data);
      break;
    }
    case "session": {
      const [player] = arg;
      if (!player) throw new Error("Usage: session <player>");
      const result = await client.getSession(player);
      if (result.error) throw new Error(result.error);
      printJson(result.data);
      break;
    }
    case "sessions": {
      if (arg.length === 0) throw new Error("Usage: sessions <player1> <player2> <player3>");
      const result = await client.getSessions(arg);
      if (result.error) throw new Error(result.error);
      printJson(result.data);
      break;
    }
    case "validate": {
      const [type, value] = arg;
      if (!type || !value) throw new Error("Usage: validate <player|username> <value>");
      if (type === "player") {
        printJson({ value, valid: validate.player(value) });
      } else if (type === "uuid") {
        printJson({ value, valid: validate.UUID(value) });
      } else if (type === "username") {
        printJson({ value, valid: validate.username(value) });
      } else {
        throw new Error("Validation type must be 'player' or 'username'.");
      }
      break;
    }
    case "utils": {
      const [action, value] = arg;
      if (!action || !value) throw new Error("Usage: utils <dash|undash> <uuid>");
      if (action === "dash") {
        printJson({ input: value, output: utils.dashUUID(value) });
      } else if (action === "undash") {
        printJson({ input: value, output: utils.undashUUID(value) });
      } else {
        throw new Error("Utils action must be 'dash' or 'undash'.");
      }
      break;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
} catch (error: unknown) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
