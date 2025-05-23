chrome plugin for crowdin

sometimes crowdin's machine translation didn't have any result,and this fix this problem by use your own ai to instead it

## this plugin must be configured or it wont work

## what you need to configure:

in js/background.js ,you need to specify the target language ,the ai provider api url and fill your access key here

in js/editor.js you may need to replace the system promote,specify the target language,the ai model name and the endpoint of the ai api url

in default  this is configured to use aliyun quen-max-latest.
