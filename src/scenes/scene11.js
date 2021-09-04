import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()

  // Meshes
  const geometry = new THREE.SphereBufferGeometry(0.5, 20, 20)
  const sphere1 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial())
  const sphere2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial())
  const sphere3 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial())
  sphere1.position.x = -1.5
  sphere3.position.x = 1.5
  scene.add(sphere1, sphere2, sphere3)

  // Raycaster
  const raycaster = new THREE.Raycaster()
  const rayHelper = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.02, 0.02, 10, 10, 10), new THREE.MeshBasicMaterial())
  rayHelper.rotation.z = Math.PI * 0.5
  scene.add(rayHelper)

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
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere1.position.y = Math.sin(elapsedTime * 0.25) * 1.5
    sphere2.position.y = Math.sin(elapsedTime * 0.75) * 1.5
    sphere3.position.y = Math.sin(elapsedTime * 1.5) * 1.5

    // Change on vector
    const rayOrigin = new THREE.Vector3(-3, 0, 0)
    const rayDirection = new THREE.Vector3(1, 0, 0)
    raycaster.set(rayOrigin, rayDirection)

    const objects = [sphere1, sphere2, sphere3]
    const intersects = raycaster.intersectObjects(objects)
    objects.forEach((obj) => obj.material.color.set('white'))
    intersects.forEach(({ object }) => object.material.color.set('red')) /* tslint:disable-line */

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
