const builder = require('esbuild');

builder.build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outfile: 'injection.js',
    loader: {
        '.ts': 'ts'
    }
}).catch(() => process.exit(1));
