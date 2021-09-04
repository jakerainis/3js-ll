import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()

  // Particle config
  const particleCount = 10000
  const particleSize = 0.25
  const spread = 100
  const spreadHalf = -spread / 2

  // This dummy object is used as a map-style reference object for each tick
  const dummy = new THREE.Object3D()

  // This instanced mesh contains each particle and is updated based on the dummy on each tick
  const mesh = new THREE.InstancedMesh(new THREE.TorusBufferGeometry(1, 2, 10), new THREE.MeshStandardMaterial({ color: 0xff8877 }), particleCount)
  scene.add(mesh)

  // Generate some random positions, speed factors and timings
  const particles = []
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      timeBasis: Math.random() * 100,
      factor: 20 + Math.random() * 100,
      speed: 0.01 + Math.random() / 200,
      spreadX: spreadHalf + Math.random() * spread,
      spreadY: spreadHalf + Math.random() * spread,
      spreadZ: spreadHalf + Math.random() * spread,
      mx: 0,
      my: 0,
    })
  }

  // Lights
  const ambientLight = new THREE.AmbientLight('white', 1)
  const pointLight = new THREE.PointLight('white', 1)
  scene.add(ambientLight, pointLight)

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
    // Iterate over instances and apply randomized positioning
    particles.forEach((particle, i) => {
      const { factor, speed, spreadX, spreadY, spreadZ } = particle
      const time = (particle.timeBasis += speed / 2)
      const offset = Math.cos(time) + Math.sin(time * 1) / 10
      const scale = (Math.cos(time) / 10) * particleSize

      // Update the dummy instance
      const particleX = (particle.mx / 10) * offset + spreadX + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10
      const particleY = (particle.my / 10) * offset + spreadY + Math.cos((time / 10) * factor) + (Math.sin(time * 2) * factor) / 10
      const particleZ = (particle.my / 10) * offset + spreadZ + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 10

      dummy.position.set(particleX, particleY, particleZ)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()

      // Apply the matrix to the instanced item
      mesh.setMatrixAt(i, dummy.matrix)
    })

    // Update mesh
    mesh.instanceMatrix.needsUpdate = true

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
