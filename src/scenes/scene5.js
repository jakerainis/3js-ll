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

  // Loaders
  const loadingManager = new THREE.LoadingManager()
  const textureLoader = new THREE.TextureLoader(loadingManager)
  const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

  // Material
  const pbr = 'rock' // alien | rock | spaceship
  const material = new THREE.MeshStandardMaterial({
    // PBR
    aoMap: textureLoader.load(`textures/${pbr}/ao.png`),
    displacementMap: textureLoader.load(`textures/${pbr}/height.png`),
    map: textureLoader.load(`textures/${pbr}/map.png`),
    metalnessMap: textureLoader.load(`textures/${pbr}/roughness.png`),
    roughnessMap: textureLoader.load(`textures/${pbr}/metalness.png`),
    normalMap: textureLoader.load(`textures/${pbr}/normal.png`),

    // Config
    displacementScale: 0,
    envMapIntensity: 0,
    metalness: 0.7,
    opacity: 1,
    roughness: 0.2,
    side: THREE.DoubleSide,
    transparent: true,
  })

  // Env Map
  const envMap = cubeTextureLoader.load([
    'textures/environmentMaps/1/px.jpg',
    'textures/environmentMaps/1/nx.jpg',
    'textures/environmentMaps/1/py.jpg',
    'textures/environmentMaps/1/ny.jpg',
    'textures/environmentMaps/1/pz.jpg',
    'textures/environmentMaps/1/nz.jpg',
  ])
  material.envMap = envMap // Apply an environment map to the maeterial
  scene.background = envMap // Apply an environment map to the scene

  // Material GUI
  const materialFolder = gui.addFolder('Material')
  materialFolder.add(material, 'displacementScale', 0, 5, 0.01).name('Displacement Scale')
  materialFolder.add(material, 'metalness', 0, 1, 0.01).name('Metalness')
  materialFolder.add(material, 'roughness', 0, 1, 0.01).name('Roughness')
  materialFolder.add(material, 'envMapIntensity', 0, 5, 0.01).name('Environment Map Intensity')

  // Geometries
  const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 50, 50), material)

  sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
  sphere.position.x = -1

  const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.5, -0.2, 50, 100), material)
  torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
  torus.position.x = 1
  scene.add(sphere, torus)

  // Lights
  const ambientLight = new THREE.AmbientLight('white', 1)
  const pointLight = new THREE.PointLight('white', 1)
  pointLight.position.set(-2, 1, 0)
  gui.add(pointLight, 'intensity', 0, 5, 0.01).name('Light Intensity')
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
