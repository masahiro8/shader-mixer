const TH = () => {
  let scene;
  let camera;
  let hemiLight;
  let renderer;
  let frame = 1.0;
  let smesh;
  let mouse = { x: 0, y: 0 };

  //ソケットで受け取った値を渡す
  let values = {};

  const init = ({ canvasId, width, height }) => {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.setClearColor(new THREE.Color(0x666666));
    document.getElementById(canvasId).appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(83, width / height, 0.1, 1000);
    camera.position.set(0, 0, 100);

    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(hemiLight);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);

    const axis = new THREE.AxesHelper(200);
    scene.add(axis);
    axis.position.set(0, 0, 0);

    mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

    window.addEventListener("mousemove", (e) => {
      mouse = { x: e.clientX, y: window.innerHeight - e.clientY };
    });

    // レンダリング
    const nrender = () => {
      requestAnimationFrame(nrender);
      frame = frame + 1.0;

      //シェーダー用メッシュを更新
      if (smesh && "uniforms" in smesh.material) {
        smesh.material.uniforms.uTime.value = frame;
        smesh.material.uniforms.uMouse.value = mouse;
        const { s_x_speed, s_y_speed, s_particles, s_size } = values;
        if (s_x_speed) smesh.material.uniforms.s_x_speed.value = s_x_speed;
        if (s_y_speed) smesh.material.uniforms.s_y_speed.value = s_y_speed;
        if (s_particles)
          smesh.material.uniforms.s_particles.value = s_particles;
        if (s_size) smesh.material.uniforms.s_size.value = s_size;
      }
      renderer.render(scene, camera);
    };
    nrender();
  };

  const addScene = (mesh) => {
    scene.add(mesh);
  };

  const addMeshShader = ({ FS_CODE, VS_CODE, TEX }) => {
    let uniforms = {
      uCenter: { value: { x: 0, y: 0, z: 0 } },
      uTime: {
        value: frame,
      },
      uMouse: { value: { x: 0, y: 0 } },
      uSize: { value: { x: window.innerWidth, y: window.innerHeight } },
      uTex: { type: "t", value: TEX },
      uAspect: { value: window.innerHeight / window.innerWidth },
      s_x_speed: { value: 0.1 },
      s_y_speed: { value: 0.1 },
      s_size: { value: 1 },
      s_particles: { value: 100 },
    };

    if (TEX) uniforms.uTex = { value: TEX };

    const mat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: VS_CODE,
      fragmentShader: FS_CODE,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: true,
    });

    //板ポリ
    const geo = new THREE.PlaneGeometry(100, 100, 1, 1);
    smesh = new THREE.Mesh(geo, mat);

    scene.add(smesh);
  };

  const updateValues = ({ s_x_speed, s_y_speed, s_particles, s_size }) => {
    //シェーダーに渡す値を調整する
    //{ s_x_speed: 20., s_y_speed: 1., s_particles: 200, s_size: .25 }
    values = {
      s_x_speed: s_x_speed * 20.0,
      s_y_speed: s_x_speed * 2.0,
      s_particles: Math.floor(s_particles * 100),
      s_size: s_size,
    };
  };

  return {
    init,
    addScene,
    addMeshShader,
    updateValues,
  };
};
