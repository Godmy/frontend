<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Define types
  export type Node3D = {
    id: string;
    name: string;
    position: { x: number; y: number; z: number };
    color?: string;
    size?: number;
  };

  export type Edge3D = {
    id: string;
    from: string;
    to: string;
    color?: string;
  };

  export type ThreeDData = {
    nodes: Node3D[];
    edges: Edge3D[];
  };

  // Props
  export let data: ThreeDData = { nodes: [], edges: [] };
  export let width: number = 800;
  export let height: number = 600;
  export let title: string = '3D Ontology Visualization';

  // Local variables
  let container: HTMLElement;
  let scene: any; // THREE.Scene
  let camera: any; // THREE.PerspectiveCamera
  let renderer: any; // THREE.WebGLRenderer
  let controls: any; // OrbitControls
  let nodes: any[] = []; // THREE.Object3D[]
  let edges: any[] = []; // THREE.Object3D[]
  let raycaster: any; // THREE.Raycaster
  let mouse: any; // THREE.Vector2
  let isMounted = false;
  let isClient = false;

  onMount(() => {
    isClient = typeof window !== 'undefined';
    if (!isClient) return;

    import('three').then(async (THREE) => {
      // Create raycaster and mouse after importing THREE
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      isMounted = true;
      init(THREE);
      animate(THREE);
    });
  });

  async function init(THREE: any) {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add orbit controls
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 100;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Create visualization based on data
    updateVisualization(THREE);
  }

  $: if (isMounted && data) {
    import('three').then((THREE) => {
      updateVisualization(THREE);
    });
  }

  function updateVisualization(THREE: any) {
    if (!scene) return;

    // Clear existing objects
    nodes.forEach(node => scene.remove(node));
    edges.forEach(edge => scene.remove(edge));
    nodes = [];
    edges = [];

    // Create nodes
    data.nodes.forEach(node => {
      const geometry = new THREE.SphereGeometry(node.size || 0.1, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: node.color || 0x4682b4
      });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.set(
        node.position.x,
        node.position.y,
        node.position.z
      );
      
      sphere.userData = { ...node }; // Store node data for interaction
      scene.add(sphere);
      nodes.push(sphere);
    });

    // Create edges
    data.edges.forEach(edge => {
      const fromNode = data.nodes.find(n => n.id === edge.from);
      const toNode = data.nodes.find(n => n.id === edge.to);

      if (fromNode && toNode) {
        const fromPos = fromNode.position;
        const toPos = toNode.position;

        // Calculate direction and distance
        const direction = new THREE.Vector3();
        direction.subVectors(
          new THREE.Vector3(toPos.x, toPos.y, toPos.z),
          new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z)
        );
        const distance = direction.length();

        // Create cylinder for edge
        const geometry = new THREE.CylinderGeometry(0.02, 0.02, distance, 8);
        const material = new THREE.MeshPhongMaterial({
          color: edge.color || 0x888888
        });
        
        const cylinder = new THREE.Mesh(geometry, material);

        // Position and orient the cylinder
        cylinder.position.set(
          (fromPos.x + toPos.x) / 2,
          (fromPos.y + toPos.y) / 2,
          (fromPos.z + toPos.z) / 2
        );
        
        // Align the cylinder with the direction
        cylinder.lookAt(new THREE.Vector3(toPos.x, toPos.y, toPos.z));
        cylinder.rotateX(Math.PI / 2); // Rotate to align with direction

        scene.add(cylinder);
        edges.push(cylinder);
      }
    });

    // Add event listeners for interaction
    renderer.domElement.addEventListener('click', onMouseClick, false);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  }

  function onMouseClick(event: MouseEvent) {
    if (!raycaster || !camera) return;
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(nodes);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      console.log('Node clicked:', object.userData);
    }
  }

  function onMouseMove(event: MouseEvent) {
    if (!raycaster || !camera) return;
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(nodes);

    // Change color of intersected nodes
    nodes.forEach(node => {
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach(mat => {
            if (mat.color && node.userData) {
              mat.color.set(node.userData.color || 0x4682b4);
            }
          });
        } else if (node.material.color) {
          node.material.color.set(node.userData?.color || 0x4682b4);
        }
      }
    });

    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (Array.isArray(object.material)) {
        object.material.forEach(mat => {
          if (mat.color) {
            mat.color.set(0xff0000);
          }
        });
      } else if (object.material.color) {
        object.material.color.set(0xff0000);
      }
    }
  }

  // Animation loop
  function animate(THREE: any) {
    if (!isMounted) return;

    requestAnimationFrame(() => animate(THREE));

    if (controls) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  onDestroy(() => {
    isMounted = false;

    // Remove event listeners
    if (renderer && renderer.domElement) {
      renderer.domElement.removeEventListener('click', onMouseClick, false);
      renderer.domElement.removeEventListener('mousemove', onMouseMove, false);
    }

    // Dispose of Three.js objects
    if (renderer) {
      renderer.dispose();
    }

    if (scene) {
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              if (material.dispose) {
                material.dispose();
              }
            });
          } else if (object.material && object.material.dispose) {
            object.material.dispose();
          }
        }
      });
    }

    // Remove controls
    if (controls && controls.dispose) {
      controls.dispose();
    }

    // Remove from DOM
    if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  });
</script>

<style>
  .three-d-visualization-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .three-d-visualization-title {
    margin-bottom: 10px;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .visualization-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    flex-grow: 1;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>

<div class="three-d-visualization-container">
  <h3 class="three-d-visualization-title">{title}</h3>
  <div bind:this={container} class="visualization-container" />
</div>