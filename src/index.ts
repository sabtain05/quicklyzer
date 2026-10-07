import { createProgram } from "./cli/program.js";

const program = createProgram();

program.parseAsync(process.argv)
.catch(() => {

    process.exit(2);

});