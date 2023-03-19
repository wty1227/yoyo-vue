// @ts-ignore
import hasRole from './permission/hasRole'
// @ts-ignore
import hasPermi from './permission/hasPermi'
// @ts-ignore
import copyText from './common/copyText'
// @ts-ignore
export default function directive(app){
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
}