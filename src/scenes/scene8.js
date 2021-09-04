import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()
  const gui = new dat.GUI({ width: 400 })

  // Meshes
  const params = {
    amplify: 3,
    branches: 10,
    colorInner: '#ff6030',
    colorOuter: '#1b3984',
    count: 200000,
    radius: 1,
    randomness: 0.2,
    size: 0.01,
    spin: 2,
  }

  let geometry = null
  let material = null
  let points = null
  const generateGalaxy = () => {
    // Clean up scene on new render
    if (points) {
      geometry.dispose()
      material.dispose()
      scene.remove(points)
    }
    geometry = new THREE.BufferGeometry()
    material = new THREE.PointsMaterial({
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      size: params.size,
      sizeAttenuation: true,
      vertexColors: true,
    })

    const positions = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)
    const colorInside = new THREE.Color(params.colorInner)
    const colorOuter = new THREE.Color(params.colorOuter)

    for (let i = 0; i < params.count; i++) {
      const i3 = i * 3
      const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2
      const radius = Math.random() * params.radius * 2
      const spinAngle = radius * params.spin
      const mixedColor = colorInside.clone()

      mixedColor.lerp(colorOuter, radius / params.radius)

      const randomX = Math.pow(Math.random(), params.amplify) * (Math.random() < 0.5 ? 1 : -1)
      const randomY = Math.pow(Math.random(), params.amplify) * (Math.random() < 0.5 ? 1 : -1)
      const randomZ = Math.pow(Math.random(), params.amplify) * (Math.random() < 0.5 ? 1 : -1)

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      colors[i3 + 0] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    points = new THREE.Points(geometry, material)
    scene.add(points)
  }
  generateGalaxy()

  // GUI
  gui.add(params, 'amplify', 1, 10, 0.001).onFinishChange(generateGalaxy)
  gui.add(params, 'branches', 2, 20, 1).onFinishChange(generateGalaxy)
  gui.addColor(params, 'colorInner').onFinishChange(generateGalaxy)
  gui.addColor(params, 'colorOuter').onFinishChange(generateGalaxy)
  gui.add(params, 'count', 100, 100000, 100).onFinishChange(generateGalaxy)
  gui.add(params, 'radius', 1, 20, 0.1).onFinishChange(generateGalaxy)
  gui.add(params, 'randomness', 0, 2, 0.001).onFinishChange(generateGalaxy)
  gui.add(params, 'size', 0.001, 0.1, 0.001).onFinishChange(generateGalaxy)
  gui.add(params, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy)

  // Camera
  const camera = new THREE.PerspectiveCamera(50, aspectRatio)
  camera.position.set(0, 3, 3)
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.autoRotate = true

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(sizes.width, sizes.height)

  // Animation
  const tick = () => {
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
