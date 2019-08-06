import typescriptPlugin from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/tinytip.cjs.js',
            format: 'cjs'
        },
        // 标签引入
        {
            file: 'dist/tinytip.js',
            format: 'iife',
            name: 'Tinytip'
        },
        // esmodule
        {
            file: 'dist/tinytip.esm.js',
            format: 'esm'
        }
    ],
    plugins: [
        typescriptPlugin()
    ]
}