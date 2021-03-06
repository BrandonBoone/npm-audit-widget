import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'

const env = process.env.NODE_ENV
const config = {
  input: 'src/index.js',
  plugins: []
}

if (env === 'es' || env === 'cjs') {
  config.output = { format: env, indent: false }
  config.plugins.push(
    babel()
  )
}

if (env === 'development' || env === 'production') {
  config.output = { format: 'umd', name: 'App', indent: false }
  config.plugins.push(
    nodeResolve({
      jsnext: true
    }),
    commonjs({
      include: ['node_modules/jszip/**'],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  )
}

if (env === 'production') {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

// config.plugins.push(
//   commonjs({
//     include: ['node_modules/jszip/**', 'node_modules/vss-web-extension-sdk/lib/VSS.SDK.js'],
//     namedExports: {
//       'node_modules/vss-web-extension-sdk/lib/VSS.SDK.js': ['VSS']
//     }
//   }),
// )

export default config