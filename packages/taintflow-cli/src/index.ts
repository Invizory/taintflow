#!/usr/bin/env node

import chalk from "chalk";
import {Command} from "commander";

const pkg = require("../package");

const program = new Command("taintflow");

program.outputHelp = function (this: typeof program) {
    const email = pkg.author.match(/<.*>/)[0];
    console.log(
        "%s by %s",
        chalk.dim.cyan("taintflow"),
        chalk.bold(email),
    );
    Reflect.apply(Command.prototype.outputHelp, this, arguments);
};

program
    .version(pkg.version)
    .usage("[options] [<file>...]")
    .option("-o, --out-file [out]",
            "transform all input files into a single file")
    .option("-d, --out-dir [out]",
            "transform an input directory of modules into an output directory")
    .option("-w, --watch",
            "retransform files on changes")
    .option("-q, --quiet",
            "don't log anything")
    .parse(process.argv);

process.argv.splice(
    2, 0,
    "--plugins", require.resolve("@taintflow/babel-plugin-transform"),
    "--no-babelrc",
    "--source-maps", "inline",
    "--source-type", "script",
    "--copy-files",
);

// tslint:disable-next-line: no-submodule-imports
require("babel-cli/bin/babel");
