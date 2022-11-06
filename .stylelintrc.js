/*
 * @Author: mjh
 * @Date: 2022-09-06 09:21:32
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 21:06:47
 * @Description: 
 */
module.exports = {
    extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-recommended-vue/scss",
        "stylelint-config-recess-order"

    ],
    overrides: [
      // 扫描.vue/html文件中的<style>标签内的样式
      {
        files: ['**/*.{vue,html}'],
        customSyntax: 'postcss-html'
      }
    ],
    // 覆盖配置（优先级大于config-standard）
    rules: {
       //配置空格数
        indentation: 4,
        'font-family-no-missing-generic-family-keyword': null,
        'no-descending-specificity': null,
        'function-url-quotes': null,
        'selector-id-pattern': null,
        'no-empty-source': null,
        'selector-class-pattern': null,
        'no-duplicate-selectors': null,
        'property-no-vendor-prefix': null, // 防止自动去除-webkit
        'scss/operator-no-unspaced': null,
        'alpha-value-notation': 'number', // 颜色透明的使用数字
        'color-function-notation': 'legacy', // 颜色值rgb用逗号分隔
        'import-notation': 'url', // 引入始终使用url
        'max-line-length': null
        // 'selector-pseudo-class-no-unknown': null,
        // 'selector-class-pattern': null,
    }
  }
  