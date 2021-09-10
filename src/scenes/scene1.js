import * as THREE from 'three'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const cursor = { x: 0, y: 0 }
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()

  // Sphere
  const segments = 40
  const geometry = new THREE.SphereBufferGeometry(1, segments, segments)
  const material = new THREE.MeshBasicMaterial({
    color: 'red',
    wireframe: true,
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Camera
  // const camera = new THREE.PerspectiveCamera(50, aspectRatio)
  // camera.position.set(0, 0, 5)
  // scene.add(camera)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)

  // Animation
  const tick = () => {
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * Math.PI
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * Math.PI
    camera.position.y = cursor.y * 5
    camera.lookAt(mesh.position)

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  tick()

  // Mouse listener
  window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = -(e.clientY / sizes.height - 0.5)
  })

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
