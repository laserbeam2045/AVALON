import * as phina from 'phina.js'
import defineMainScene from './display/scene/MainScene'
import defineInputScene from './display/scene/InputScene'
import MyGameApp from './game/MyGameApp'

// ゲームを作成する関数
// 戻り値：Promise
// (成功時：ゲームインスタンスをresolve)
export default (options) => {
  return new Promise(resolve => {
    defineMainScene()
    defineInputScene()

    phina.main(() => {
      const app = MyGameApp(options).run()
      resolve(app.getGameMethods())
    })
  })
}