import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()

  //  Model
  let mixer
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('models/Fox/glTF/Fox.gltf', (gltf) => {
    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()

    gltf.scene.scale.set(0.025, 0.025, 0.025)
    scene.add(gltf.scene)
  })

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0, roughness: 0.5 })
  )
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)

  //  Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Camera
  const camera = new THREE.PerspectiveCamera(50, aspectRatio)
  camera.position.set(0, 3, 10)
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.autoRotate = true

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(sizes.width, sizes.height)

  // Animation
  const clock = new THREE.Clock()
  let oldElapsedTime = 0
  const tick = () => {
    // Animate fox
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    mixer && mixer.update(deltaTime)

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  tick()

  // Resize listener
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = aspectRatio
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}
