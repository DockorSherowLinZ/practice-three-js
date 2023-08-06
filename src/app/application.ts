import {BoxGeometry, Camera, Mesh, MeshBasicMaterial,  PerspectiveCamera, Scene, TextureLoader, WebGLRenderer} from 'three';
export class Application {
  private scene: Scene = new Scene();
  private camera: Camera = new PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
/*相機需要的參數：constructor(fov?: number, aspect?: number, near?: number, far?: number);
景深：fov Camera frustum vertical field of view. Default `50`.
視圖長寬比：aspect Camera frustum aspect ratio. Default `1`.
近景：near Camera frustum near plane. Default `0.1`.
遠景：far Camera frustum far plane. Default `2000`.
*/
  private renderer: WebGLRenderer = new WebGLRenderer({antialias:true});

  constructor(){
    document.body.appendChild(this.renderer.domElement)
    this.onWindowResize();
    window.addEventListener('resize',()=> this.onWindowResize())
    
    // 載入材質
    const textureLoader = new TextureLoader();
    const boxTexture = textureLoader.load('assets/texture/SurfaceWood.jpg');

    // 定義一個 mesh 為 1,1,1 網格與 #fb3 為材質色的模型
    const boxGeometry = new BoxGeometry(1,1,1);
    // const meshBasicMaterial = new MeshBasicMaterial({color:'#fb3'})
    const meshBasicMaterial = new MeshBasicMaterial({map:boxTexture})
    const mesh = new Mesh(boxGeometry, meshBasicMaterial);
    
    // 稱呼 mesh 的名字為 box
    mesh.name ="box";

    // 設定相機位置
    this.camera.position.set(0,0,5);

    // 在場景中置入模型
    this.scene.add(mesh);

    // 執行方法： render
    this.render();
  }
  
  // 方法：render
  private render(){
    window.requestAnimationFrame(()=>this.render());
    const box = this.scene.getObjectByName('box');

    // box旋轉
    if (box){
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;
      box.rotation.z += 0.01;
    }
        
    this.renderer.render(this.scene, this.camera)
  }

  // 自適應網頁視窗
  private onWindowResize(){
    this.renderer.setSize(window.innerWidth,window.innerHeight)
  }
}
