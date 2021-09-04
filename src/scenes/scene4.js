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
  const material = new THREE.MeshStandardMaterial()

  const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material)
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -0.5
  plane.receiveShadow = true

  const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material)
  sphere.castShadow = true

  const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      alphaMap: textureLoader.load('/textures/shadows/simpleShadow.jpg'),
      color: 0x000000,
      transparent: true,
    })
  )
  sphereShadow.rotation.x = -Math.PI * 0.5
  sphereShadow.position.y = plane.position.y + 0.01
  scene.add(sphereShadow)

  scene.add(sphere, plane)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight('teal', 1)
  pointLight.castShadow = true
  pointLight.position.set(0, 2, 0)
  scene.add(pointLight)

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
  scene.add(pointLightHelper)

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
  renderer.shadowMap.enabled = true

  // Animation
  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    pointLight.position.x = -Math.cos(elapsedTime) * 1
    pointLight.position.z = -Math.cos(elapsedTime) * 1
    pointLight.lookAt(new THREE.Vector3())

    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    sphere.position.z = Math.sin(elapsedTime) * 1.5

    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = 1 - Math.abs(sphere.position.y)

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
