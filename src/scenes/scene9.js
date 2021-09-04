import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()

  // Scene
  scene.background = new THREE.Color('#262637')
  scene.fog = new THREE.Fog('#262637', 1, 15)
  const textureLoader = new THREE.TextureLoader()

  // Ground
  const groundColor = textureLoader.load('/textures/grass/color.jpg')
  groundColor.repeat.set(8, 8)
  groundColor.wrapT = THREE.RepeatWrapping
  groundColor.wrapS = THREE.RepeatWrapping
  const groundAmbientOcclusion = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
  groundAmbientOcclusion.repeat.set(8, 8)
  groundAmbientOcclusion.wrapT = THREE.RepeatWrapping
  groundAmbientOcclusion.wrapS = THREE.RepeatWrapping
  const groundNormal = textureLoader.load('/textures/grass/normal.jpg')
  groundNormal.repeat.set(8, 8)
  groundNormal.wrapT = THREE.RepeatWrapping
  groundNormal.wrapS = THREE.RepeatWrapping
  const groundRoughness = textureLoader.load('/textures/grass/roughness.jpg')
  groundRoughness.repeat.set(8, 8)
  groundRoughness.wrapT = THREE.RepeatWrapping
  groundRoughness.wrapS = THREE.RepeatWrapping
  const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      color: '#a9c388',
      map: groundColor,
      aoMap: groundAmbientOcclusion,
      normalMap: groundNormal,
      roughnessMap: groundRoughness,
      transparent: true,
    })
  )
  ground.rotation.x = -Math.PI * 0.5
  ground.position.y = 0
  scene.add(ground)

  // Graves
  const graves = new THREE.Group()
  const graveGeo = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
  const graveMesh = new THREE.MeshStandardMaterial({ color: '#626262' })
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeo, graveMesh)
    grave.position.set(x, 0.4, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.2
    grave.castShadow = true
    graves.add(grave)
  }
  scene.add(graves)

  // House
  const house = new THREE.Group()

  const roof = new THREE.Mesh(new THREE.ConeBufferGeometry(3.5, 1, 4), new THREE.MeshStandardMaterial({ color: '#b35f45' }))
  roof.position.y = 2.5 + 0.5
  roof.rotation.y = Math.PI * 0.25

  const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
      color: '#ac8e82',
      map: textureLoader.load('/textures/bricks/color.jpg'),
      aoMap: textureLoader.load('/textures/bricks/ambientOcclusion.jpg'),
      normalMap: textureLoader.load('/textures/bricks/normal.jpg'),
      roughnessMap: textureLoader.load('/textures/bricks/roughness.jpg'),
      transparent: true,
    })
  )
  walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
  walls.position.y = 2.5 / 2

  const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: textureLoader.load('/textures/door/color.jpg'),
      alphaMap: textureLoader.load('/textures/door/alpha.jpg'),
      aoMap: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
      displacementMap: textureLoader.load('/textures/door/height.jpg'),
      displacementScale: 0.1,
      metalnessMap: textureLoader.load('/textures/door/metalness.jpg'),
      normalMap: textureLoader.load('/textures/door/normal.jpg'),
      roughnessMap: textureLoader.load('/textures/door/roughness.jpg'),
      transparent: true,
    })
  )
  door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
  door.position.y = 1
  door.position.z = 2.01
  house.add(door, roof, walls)

  // Bushes
  const bushGeo = new THREE.SphereBufferGeometry(1, 16, 16)
  const bushMat = new THREE.MeshStandardMaterial({ color: '#89c854' })
  const bush1 = new THREE.Mesh(bushGeo, bushMat)
  bush1.scale.set(0.5, 0.5, 0.5)
  bush1.position.set(1, 0.25, 2.5)
  const bush2 = new THREE.Mesh(bushGeo, bushMat)
  bush2.scale.set(0.25, 0.25, 0.25)
  bush2.position.set(1.5, 0.2, 2.5)
  const bush3 = new THREE.Mesh(bushGeo, bushMat)
  bush3.scale.set(0.3, 0.3, 0.3)
  bush3.position.set(-1.5, 0.2, 2.5)
  const bush4 = new THREE.Mesh(bushGeo, bushMat)
  bush4.scale.set(0.5, 0.5, 0.5)
  bush4.position.set(-1, 0.25, 2.5)
  house.add(bush1, bush2, bush3, bush4)

  scene.add(house)

  // Ambient Light
  const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.15)
  scene.add(ambientLight)

  // Moon light
  const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.15)
  moonLight.position.set(4, 5, -2)
  scene.add(moonLight)

  // Door Light
  const doorLight = new THREE.PointLight('#ff7d46', 1, 7, 1)
  doorLight.position.set(0, 2.5, 2.25)
  house.add(doorLight)

  // Ghosts
  const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
  const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
  const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
  scene.add(ghost1, ghost2, ghost3)

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

  // Shadows
  renderer.shadowMap.enabled = true
  moonLight.castShadow = true
  doorLight.castShadow = true
  ghost1.castShadow = true
  ghost2.castShadow = true
  ghost3.castShadow = true
  walls.castShadow = true
  bush1.castShadow = true
  bush2.castShadow = true
  bush3.castShadow = true
  bush4.castShadow = true
  ground.receiveShadow = true

  //Optimizations
  doorLight.shadow.mapSize.width = 256
  doorLight.shadow.mapSize.height = 256
  doorLight.shadow.camera.far = 7
  ghost1.shadow.mapSize.width = 256
  ghost1.shadow.mapSize.height = 256
  ghost1.shadow.camera.far = 7
  ghost2.shadow.mapSize.width = 256
  ghost2.shadow.mapSize.height = 256
  ghost2.shadow.camera.far = 7
  ghost3.shadow.mapSize.width = 256
  ghost3.shadow.mapSize.height = 256
  ghost3.shadow.camera.far = 7

  // Animation
  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Animate ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 2)
    const ghost2Angle = -elapsedTime * 0.2
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 1) + Math.sin(elapsedTime * 2.5)
    const ghost3Angle = -elapsedTime * 0.5
    ghost3.position.x = Math.cos(ghost3Angle) * Math.sin(elapsedTime * 2.5) + 2
    ghost3.position.z = Math.sin(ghost3Angle) * Math.sin(elapsedTime * 2.5) + 2
    ghost3.position.y = Math.sin(elapsedTime * 2)

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
