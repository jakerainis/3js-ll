import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()
  const loadingManager = new THREE.LoadingManager()
  const textureLoader = new THREE.TextureLoader(loadingManager)

  // Objects
  const geometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
  const material = new THREE.MeshMatcapMaterial({
    matcap: textureLoader.load('/textures/matcaps/3.png'),
  })

  const donuts = []
  for (let i = 0; i < 500; i++) {
    const donut = new THREE.Mesh(geometry, material)
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    const scale = Math.random() * 1
    donut.scale.set(scale, scale, scale)
    donuts.push(donut)
    scene.add(donut)
  }

  // Camera
  const camera = new THREE.PerspectiveCamera(50, aspectRatio)
  camera.position.set(0, 0, 5)
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(sizes.width, sizes.height)

  // Animation
  const tick = () => {
    donuts.forEach((donut) => {
      donut.rotation.x += 0.01
      donut.rotation.y += 0.01
      donut.rotation.z += 0.01
    })
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
