import Stats from 'stats.js'

import {OrbitControls} from 'src/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {} from 'three/examples/jsm/loaders/FBXLoader'
import {BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial,  PerspectiveCamera, Scene, TextureLoader, WebGLRenderer, AmbientLight, AnimationMixer, Clock, PlaneGeometry, GridHelper, Raycaster, Vector2, Plane,AnimationAction, Object3D, AnimationClip, MeshStandardMaterial} from 'three';
// import {BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial,  PerspectiveCamera, Scene, TextureLoader, WebGLRenderer, PlaneBufferGeometry, GridHelper} from 'three';
export class Application {
  private scene: Scene = new Scene();
  private camera: PerspectiveCamera = new PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
/*相機需要的參數：constructor(fov?: number, aspect?: number, near?: number, far?: number);
景深：fov Camera frustum vertical field of view. Default `50`.
視圖長寬比：aspect Camera frustum aspect ratio. Default `1`.
近景：near Camera frustum near plane. Default `0.1`.
遠景：far Camera frustum far plane. Default `2000`.
*/
  private renderer: WebGLRenderer = new WebGLRenderer({antialias:true});
  private stats: Stats;
  private gltfLoader: GLTFLoader;
  private animationMixer: AnimationMixer = new AnimationMixer(this.scene);
  private clock: Clock = new Clock();
  private action:any|AnimationAction;
  private gltf: any;

  constructor(){
    document.body.appendChild(this.renderer.domElement)
    this.onWindowResize();
    window.addEventListener('resize',()=> this.onWindowResize())
    
    // 載入 glTFLoader 工具
    this.gltfLoader = new GLTFLoader();
    
    // 載入材質
    const textureLoader = new TextureLoader();
    const boxTexture = textureLoader.load('assets/texture/SurfaceWood.jpg');

    // 定義一個 mesh 為 1,1,1 網格與 #fb3 為材質色的模型
    const boxGeometry = new BoxGeometry(1,1,1);
    
    /*----------------材質設定方法----------------*/
    /* 材質為顏色
    const meshBasicMaterial = new MeshBasicMaterial({color:'#fb3'})
    */ 
   /* 材質為單面
   const meshBasicMaterial = new MeshBasicMaterial({map:boxTexture})
   */
  /* 材質為雙面*/
  const meshBasicMaterial = new MeshBasicMaterial({map:boxTexture, side:DoubleSide})

  const mesh = new Mesh(boxGeometry, meshBasicMaterial);
    
    // 稱呼 mesh 的名字為 box
    mesh.name ="box";

    // 設置環境大小與材質貼圖
    const skyboxGeometry = new BoxGeometry (500,500,500);
    const skyboxMaterials = [
      new MeshBasicMaterial({ map: textureLoader.load('assets/texture/r.png'),side:DoubleSide}),
      new MeshBasicMaterial({ map: textureLoader.load('assets/texture/l.png'),side:DoubleSide}),
      new MeshBasicMaterial({ map: textureLoader.load('assets/texture/t.png'),side:DoubleSide}),
      new MeshBasicMaterial({ map: textureLoader.load('assets/texture/m.png'),side:DoubleSide}),
      new MeshBasicMaterial({ map: textureLoader.load('assets/texture/k.png'),side:DoubleSide}),
      new MeshBasicMaterial({ map: textureLoader.load('assets/texture/f.png'),side:DoubleSide}),
    ];
    const skyboxMesh = new Mesh(skyboxGeometry, skyboxMaterials);
    skyboxMesh.name ='skyboxMesh'

    // 設定相機位置
    this.camera.position.set(1,2,4); // 2,2,4

    // 在場景中置入模型與環境
    // this.scene.add(mesh);
    this.scene.add(skyboxMesh);    

    // 生成 FPS 指示器
    this.stats = new Stats();
    this.stats.showPanel(0)
    window.document.body.appendChild(this.stats.dom);

    /*滑鼠控制器 OrbitControls，左鍵拖曳；中鍵縮放；右鍵平移*/ 
    new OrbitControls(this.camera, this.renderer.domElement);

    // 定義一個地面(plane)
    const planGeometry = new PlaneGeometry(10,10);
    // plane 材質, 為雙面
    const plane = new Mesh(planGeometry, new MeshStandardMaterial(
      { map: textureLoader.load("assets/texture/Scifi_Floor_albedo.jpg"),
        roughnessMap: textureLoader.load("assets/texture/Scifi_Floor_roughness.jpg"),      
        normalMap: textureLoader.load("assets/texture/Scifi_Floor_normal.jpg"),
        // displacementMap: textureLoader.load("assets/texture/Scifi_Floor_height.jpg"),
        aoMap: textureLoader.load("assets/texture/Scifi_Floor_ao.jpg"),
      side:DoubleSide}     
    ));
    plane.name = 'plane'; 
    
    // 旋轉角度(弧度) 二分之一 PI
    plane.rotation.x = - Math.PI / 2;
    plane.rotation.z = Math.PI / 2;
    this.scene.add(plane);
    // add grid
    // this.scene.add(new GridHelper(100, 100));

    // load gltf model
    /* this.gltfLoader.load('assets/P005Printer3_v3.glb', gltf =>{
        console.log(gltf);
        this.gltf = gltf;
        gltf.scene.name ='P005Printer3';
        this.scene.add(gltf.scene);
        // add light
        this.scene.add(new AmbientLight(0xFFFFFF,2));
    */
    this.gltfLoader.load('assets/Soldier.glb', gltf =>{
      console.log(gltf);
      this.gltf = gltf;
      gltf.scene.name ='Soldier';
      this.scene.add(gltf.scene);
      // add light
      this.scene.add(new AmbientLight(0xFFFFFF,2));
      
      // Soldier 調整 Z軸 位置 
      gltf.scene.position.set(0,0,3)


      // 初始播放的動作
      const animationClip = gltf.animations.find(animationClip => animationClip.name === 'Idle');
      this.action = this.animationMixer.clipAction(animationClip!);
      this.action.play();
    });

    // 偵測點擊事件
    this.renderer.domElement.addEventListener('click', event => {
      const { offsetX, offsetY } = event;
      const x = (offsetX / window.innerWidth) * 2 - 1;
      const y = -(offsetY / window.innerHeight) * 2 + 1;
      const mothPoint = new Vector2(x, y);

      const raycaster = new Raycaster();
      raycaster.setFromCamera(mothPoint, this.camera);

      // 設置要忽略點擊事件的物件 
      const intersects = raycaster.intersectObjects(this.scene.children,true);
      const intersect = intersects.filter(intersect => !(intersect.object instanceof GridHelper) && intersect.object.name !== 'plane')[0];
      
      // 如果被點擊時，要執行的事件
      if(intersect && this.isClickSoldier(intersect.object)){
        // console.log(intersect);
        const clips = ["Idle", "Run", "Walk"];
        const currentClipIdx = clips.findIndex(clip => clip===(this.action as AnimationAction).getClip().name);
        const clipTargetName = clips[(currentClipIdx+1) % (clips.length)];
        console.log(clipTargetName)
        const animationClip = this.gltf.animations.find((animationClip:AnimationClip) => animationClip.name === clipTargetName);
        this.action.stop();
        this.action = this.animationMixer.clipAction(animationClip!);
        this.action.play();

        // const isRunning = (this.action as AnimationAction).isRunning();
        // isRunning? this.action.stop() : this.action.play();
      }
    });

    // 執行方法： render
    this.render();
  }
  
  private isClickSoldier(object: Object3D): any{
    if(object.name === 'Soldier'){
      return object;
    } else if(object.parent){
      return this.isClickSoldier(object.parent)
    } else {
      return null;
    }
  }

  // 方法：render
  private render(){

    // FPS 指示器開始
    this.stats.begin()
   
    window.requestAnimationFrame(()=>this.render());

    this.animationMixer.update(this.clock.getDelta());

    const skyboxMesh = this.scene.getObjectByName('skyboxMesh');
    /**/
    // skyboxMesh!.rotation.x += 0.001
    // skyboxMesh!.rotation.y += 0.0001
    // skyboxMesh!.rotation.z += 0.001
    
    const box = this.scene.getObjectByName('box');    
    /* box旋轉 
    if (box){
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;
      box.rotation.z += 0.01;
    }
    */
   
   // FPS 指示器結束
   this.stats.end()


    this.renderer.render(this.scene, this.camera)
  }

  // 自適應網頁視窗
  private onWindowResize(){
    this.renderer.setSize(window.innerWidth,window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
function loadTexture(arg0: string) {
  throw new Error('Function not implemented.');
}

