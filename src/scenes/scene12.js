import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Scene() {
  // Setup scene
  const canvas = document.querySelector('canvas.webgl')
  const sizes = { width: window.innerWidth, height: window.innerHeight }
  const aspectRatio = sizes.width / sizes.height
  const scene = new THREE.Scene()

  // Phsyics World
  // https://en.wikipedia.org/wiki/Gravitational_acceleration
  const world = new CANNON.World()
  world.gravity.set(0, -9.82, 0) // -9.82 is earth's gravity
  world.broadphase = new CANNON.SAPBroadphase(world)
  world.allowSleep = true

  //Phsyics Materials (these names are arbitrary)
  const concrete = new CANNON.Material('concrete')
  const plastic = new CANNON.Material('plastic')
  const concretePlasticContact = new CANNON.ContactMaterial(concrete, plastic, { friction: 0.2, restitution: 0.8 })
  world.addContactMaterial(concretePlasticContact)

  // Phsyics Floor
  const floorShape = new CANNON.Plane()
  const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    material: concrete,
  })
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
  world.addBody(floorBody)

  // Scene Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: '#777777', metalness: 0.5, roughness: 0.25 })
  )
  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
  directionalLight.castShadow = true
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

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
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Utils
  const objectsToUpdate = []
  const geoBox = new THREE.BoxBufferGeometry(1, 1, 1)
  const geoSphere = new THREE.SphereBufferGeometry(1, 20, 20)
  const mat = new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.4 })

  const createBox = (w, h, d, position) => {
    const mesh = new THREE.Mesh(geoBox, mat)
    mesh.castShadow = true
    mesh.position.copy(position)
    mesh.scale.set(w, h, d)
    scene.add(mesh)

    const shape = new CANNON.Box(new CANNON.Vec3(w * 0.5, h * 0.5, d * 0.5))
    const body = new CANNON.Body({ mass: 1, material: plastic, shape: shape })
    body.position.copy(position)

    world.addBody(body)
    objectsToUpdate.push({ mesh, body })
  }
  const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(geoSphere, mat)
    mesh.castShadow = true
    mesh.position.copy(position)
    mesh.scale.set(radius, radius, radius)
    scene.add(mesh)

    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({ mass: 1, material: plastic, shape: shape })
    body.position.copy(position)

    world.addBody(body)
    objectsToUpdate.push({ mesh, body })
  }

  const actions = {
    createSphere: () => {
      createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 5,
        z: (Math.random() - 0.5) * 3,
      })
    },
    createBox: () => {
      createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 5,
        z: (Math.random() - 0.5) * 3,
      })
    },
  }

  // Animation
  let oldElapsedTime = 0
  const clock = new THREE.Clock()
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)
    objectsToUpdate.forEach((obj) => {
      obj.mesh.position.copy(obj.body.position)
      obj.mesh.quaternion.copy(obj.body.quaternion)
    })

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
  }
  tick()

  // On click
  window.addEventListener('mousedown', (e) => {
    actions.createBox()
    actions.createSphere()
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
