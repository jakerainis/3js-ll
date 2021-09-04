import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()

  // Group of Cubes
  const group = new THREE.Group()

  const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
  const material = new THREE.MeshBasicMaterial({
    color: 'red',
    wireframe: true,
  })

  // Cube 1
  const cube1 = new THREE.Mesh(geometry, material)
  group.add(cube1)

  // Cube 2
  const cube2 = new THREE.Mesh(geometry, material)
  cube2.position.x = 2
  group.add(cube2)

  // Cube 3
  const cube3 = new THREE.Mesh(geometry, material)
  cube3.position.x = -2
  group.add(cube3)

  group.position.set(0, 0, 0)
  scene.add(group)

  // Axes Helper
  const axesHelper = new THREE.AxesHelper()
  scene.add(axesHelper)

  // Camera
  const camera = new THREE.PerspectiveCamera(50, aspectRatio)
  camera.position.set(0, 0, 5)
  scene.add(camera)

  // Renderer
  const controls = new OrbitControls(camera, canvas)
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)

  // Debug
  const gui = new dat.GUI({ width: 400 })
  gui.add(material, 'wireframe')

  // Animation
  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    group.position.x = Math.sin(elapsedTime)
    group.position.y = Math.cos(elapsedTime)

    cube1.rotation.x = (elapsedTime / 2) * Math.PI
    cube1.rotation.y = (elapsedTime / 2) * Math.PI
    cube2.rotation.y = Math.sin(-elapsedTime)
    cube3.rotation.y = Math.sin(elapsedTime)

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
