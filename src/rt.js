// struct-static-robust.js
const fs = require('fs');

// --- Lexer ---
function tokenize(input) {
    input = input.replace(/<<.*$/gm, ''); // remove comments
    const regex = /construct|println|=>|String|Num|Bool|Arith|"[^"]*"|\d+|\w+|[\[\]{}();+\-*/]/g;
    return input.match(regex) || [];
}

// --- Parser ---
function parse(tokens) {
    const constructs = [];
    const statements = [];
    let i = 0;

    function parseConstruct() {
        i++; // skip 'construct'
        const name = tokens[i++];
        if (tokens[i++] !== '=>') throw new Error('Expected =>');
        if (tokens[i++] !== '[') throw new Error('Expected [');

        const values = [];
        while (tokens[i] !== ']') {
            const type = tokens[i++];

            if (type === 'Arith') {
                if (tokens[i++] !== '{') throw new Error('Expected { for Arith');
                const exprTokens = [];
                while (tokens[i] !== '}') exprTokens.push(tokens[i++]);
                if (tokens[i++] !== '}') throw new Error('Expected } for Arith');
                if (tokens[i++] !== ';') throw new Error('Expected ; after Arith');
                values.push(eval(exprTokens.join('')));
                continue;
            }

            let value = tokens[i++];
            if (type === 'String') {
                if (!/^".*"$/.test(value)) throw new Error('Invalid string literal');
                value = value.slice(1, -1);
            } else if (type === 'Num') value = Number(value);
            else if (type === 'Bool') value = value === 'true';

            if (tokens[i++] !== ';') throw new Error('Expected ; after value');
            values.push(value);
        }
        i++; // skip closing ']'
        return { name, values };
    }

    function parsePrint() {
        i++; // skip 'println'
        const target = tokens[i++];
        if (tokens[i++] !== ';') throw new Error('Expected ; after println');
        return { type: 'print', target };
    }

    while (i < tokens.length) {
        if (tokens[i] === 'construct') constructs.push(parseConstruct());
        else if (tokens[i] === 'println') statements.push(parsePrint());
        else i++;
    }

    return { constructs, statements };
}

// --- Runtime ---
class StructRuntime {
    constructor() {
        this.env = {};
        this.statements = [];
    }

    load(ast) {
        for (const c of ast.constructs) {
            this.env[c.name] = c.values;
        }
        this.statements = ast.statements;
    }

    run() {
        for (const stmt of this.statements) {
            if (stmt.type === 'print') {
                const values = this.env[stmt.target];
                if (!values) continue;
                console.log(values.join(' '));
            }
        }
    }
}



function runFile(filePath) {
    const source = fs.readFileSync(filePath, 'utf8');
    const tokens = tokenize(source);
    const ast = parse(tokens);

    const runtime = new StructRuntime();
    runtime.load(ast);
    runtime.run();
}

// --- CLI / Node usage ---
if (require.main === module) {
    const args = process.argv.slice(2);
    if (!args[0]) {
        console.error("Usage: node struct-static-robust.js <file.struct>");
        process.exit(1);
    }

    for (const file of args) {
        if (!fs.existsSync(file)) {
            console.error(`File not found: ${file}`);
            continue;
        }
        console.log(`\n=== Running ${file} ===`);
        runFile(file);
        console.log(`=== Finished ${file} ===\n`);
    }
}

// Export for external use if needed
module.exports = { runFile };

