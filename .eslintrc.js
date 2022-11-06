/*
 * @Author: mjh
 * @Date: 2022-09-06 09:21:32
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-11 20:02:47
 * @Description:
 */
module.exports = {
    extends: ['@antfu'],
    rules: {
        'indent': ['error', 4], // 4个空格缩进
        '@typescript-eslint/indent': 'off',
        'vue/component-tags-order': ['error', {
            order: [['template', 'script'], 'style'],
        }],
        'no-console': 'off',
        'no-unused-expressions': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'vue/html-indent': ['warn', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: []
        }],
        'antfu/if-newline': 'off',
        'eslint-comments/no-unlimited-disable': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'vue/custom-event-name-casing': 'off',
        'no-async-promise-executor': 'off'
        //     ['error',
        //     'kebab-case',
        //     {
        //         ignores: []
        //     }
        // ]
    },
}
