import { ColorGUIHelper } from '../utils'

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

  // Material
  const material = new THREE.MeshStandardMaterial()
  material.side = THREE.DoubleSide
  material.metalness = 0.4
  material.roughness = 0.4

  // Objects
  const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material)
  sphere.position.x = -1.5

  const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(0.75, 0.75, 0.75), material)

  const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64), material)
  torus.position.x = 1.5

  const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material)
  plane.rotation.x = -Math.PI * 0.5
  plane.position.y = -0.65

  scene.add(sphere, cube, torus, plane)

  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const ambientFolder = gui.addFolder('Ambient Light')
  ambientFolder.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('Ambient Color')
  ambientFolder.add(ambientLight, 'intensity', 0, 2, 0.01).name('Ambient Intensity')

  // Directional Light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(3, 0.25, 0)
  scene.add(directionalLight)

  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
  scene.add(directionalLightHelper)

  const directionalFolder = gui.addFolder('Directional Light')
  directionalFolder.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('Directional Light Color')
  directionalFolder.add(directionalLight, 'intensity', 0, 4, 0.01).name('Directional Intensity')
  directionalFolder.add(directionalLight.position, 'x', -4, 4, 0.01).name('Directional X')
  directionalFolder.add(directionalLight.position, 'y', -4, 4, 0.01).name('Directional Y')
  directionalFolder.add(directionalLight.position, 'z', -4, 4, 0.01).name('Directional Z')

  // Point Light
  const pointLight = new THREE.PointLight(0xffffff, 0.5)
  pointLight.position.set(0, 1, 1)
  scene.add(pointLight)

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
  scene.add(pointLightHelper)

  const pointFolder = gui.addFolder('Point Light')
  pointFolder.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('Point Light Color')
  pointFolder.add(pointLight, 'intensity', 0, 4, 0.01).name('Point Intensity')
  pointFolder.add(pointLight.position, 'x', -4, 4, 0.01).name('Point X')
  pointFolder.add(pointLight.position, 'y', -4, 4, 0.01).name('Point Y')
  pointFolder.add(pointLight.position, 'z', -4, 4, 0.01).name('Point Z')

  const materialFolder = gui.addFolder('Material')
  materialFolder.add(material, 'metalness', 0, 2, 0.01).name('Metalness')
  materialFolder.add(material, 'roughness', 0, 2, 0.01).name('Roughness')

  // Camera
  const camera = new THREE.PerspectiveCamera(50, aspectRatio)
  camera.position.set(0, 0, 5)
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Animation
  const tick = () => {
    controls.update()
    // spotlightHelper.update()
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
