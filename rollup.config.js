import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

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
        resolve({ 
            extensions,
        }),
        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs(),
        babel({
            extensions,
            exclude: ['node_modules/**', 'dist/**']
        })
    ]
}