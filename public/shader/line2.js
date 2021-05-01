const VS_CODE = `
uniform float uAspect;
uniform vec3 uCenter;
uniform vec2 uMouse;

//フラグメントシェーダーに変数を渡す
varying vec2 vUv;
varying vec4 sPosition;

void main() {
  vUv = uv;
  vec3 pos = position;
  gl_PointSize = 1.0;
  gl_Position = vec4( pos, 1.0 );
}
`;

const FS_CODE = `

uniform vec2 uMouse;
uniform vec2 uSize;
uniform float uTime;

//ソケットからの値
uniform float s_size;
uniform int s_particles;
uniform float s_x_speed;
uniform float s_y_speed;
uniform float s_x_position;
uniform float s_y_position;

//バーテックスシェーダーから変数を受け取る
varying vec2 vUv;
varying vec4 sPosition;

// テクスチャは sampler2D 型
uniform sampler2D uTex;

const float PI  = 3.141592653589793;

void main( void ) {

  // テクスチャのuv座標地点の色 rgba を取得
  vec4 color = texture2D( uTex, vUv ).rgba;

  //マウスからの距離
  // float distance = sqrt( pow(uMouse.x - gl_FragCoord.x, 2.) + pow(gl_FragCoord.y - uMouse.y, 2.));
  // float _a = distance < 10.?(10.-distance)/10.:0.;

  vec2 _size = uSize;

  //座標の正規化
  float rs = 100.;
  vec2 pos = (gl_FragCoord.xy * 2.0 - _size) / rs;

  //マウス座標で形状変化
  // float norm_x = uMouse.x / _size.x * .5;
  // float norm_y = uMouse.y / _size.y * .5;

  //コントローラから形状変化
  float norm_x = s_x_position;
  float norm_y = s_y_position;

  //画面の正規化
  float size_x = 100. / uSize.x;
  float size_y = 100. / uSize.y;

  float v = 0.0;
  
  //設定
  // int c = 200;// パーティクルの数、iを増加させると円の大きさが大きくなる
  // float speed_x = 20.;//アニメーション速度
  // float speed_y = 1.;//アニメーション速度
  // float p = .25;//パーティクルの大きさ

  int c = s_particles;// パーティクルの数、iを増加させると円の大きさが大きくなる
  float speed_x = s_x_speed;//アニメーション速度
  float speed_y = s_x_speed;//アニメーション速度
  float p = s_size;//パーティクルの大きさ

  for (int i = 0; i < c; i++) {
    
    // float m = uTime + float(i) * 0.1; //曲線の長さ
    // float s = uTime + float(i) * 0.2; //曲線の長さ
    
    float m = (uTime + float(i) * 0.1) * speed_x * norm_x; //曲線の長さ
    float s = (uTime + float(i) * 0.2) * speed_y * norm_y; //曲線の長さ

    vec2 mpos = vec2(
      uSize.x * .02 * norm_x * cos(m),
      uSize.y * .02 * norm_y * sin(s)
    );

    float t = p / length( mpos - pos); // 曲線の太さ
    v += pow(t,2.) * float(i)/100.0 ; //曲線の太さ＆ぼかし
  }

  gl_FragColor = vec4(vec3(v,v,0), 1.0);

}
`;

export { VS_CODE, FS_CODE };
