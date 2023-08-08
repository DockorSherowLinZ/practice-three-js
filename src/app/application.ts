import Stats from 'stats.js'

import {OrbitControls} from 'src/controls/OrbitControls'

import {BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial,  PerspectiveCamera, Scene, TextureLoader, WebGLRenderer} from 'three';
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

  constructor(){
    document.body.appendChild(this.renderer.domElement)
    this.onWindowResize();
    window.addEventListener('resize',()=> this.onWindowResize())
    
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
    const skyboxGeometry = new BoxGeometry (200,200,200);
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
    this.camera.position.set(0,0,5);

    // 在場景中置入模型與環境
    this.scene.add(mesh);
    this.scene.add(skyboxMesh);    

    // 生成 FPS 指示器
    this.stats = new Stats();
    this.stats.showPanel(0)
    window.document.body.appendChild(this.stats.dom);

    /*滑鼠控制器 OrbitControls，左鍵拖曳；中鍵縮放；右鍵平移*/ 
    new OrbitControls(this.camera, this.renderer.domElement);

    // 執行方法： render
    this.render();
  }
  
  // 方法：render
  private render(){

    // FPS 指示器開始
    this.stats.begin()

    window.requestAnimationFrame(()=>this.render());
    const skyboxMesh = this.scene.getObjectByName('skyboxMesh');
    skyboxMesh!.rotation.x += 0.001
    skyboxMesh!.rotation.y += 0.001
    skyboxMesh!.rotation.z += 0.001

    const box = this.scene.getObjectByName('box');    
    /* box旋轉 */
    if (box){
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;
      box.rotation.z += 0.01;
    }
    
   
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
