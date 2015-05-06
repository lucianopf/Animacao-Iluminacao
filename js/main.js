 
    var x = window.innerWidth + (window.innerWidth*0.05);
    var y = window.innerHeight  + (window.innerHeight*0.05);

    var container = document.getElementById('container');
    var renderer = new FSS.CanvasRenderer();
    var scene = new FSS.Scene();
    // Primeiro a parede dps a luz
    var light = new FSS.Light('#444444', '#AE0418');
    var light2 = new FSS.Light('#222222', '#CC292F');
    var geometry = new FSS.Plane(x, y, 16, 8);
    // Tom da parede e nao a cor.
    var material = new FSS.Material('#444444', '#FECEB3');
    var qtd = geometry.triangles.length;
    var xRange = 0.4;
    var yRange = 0.2;
    var zRange = 1;
    var speed  = 0.004;
    var depth  = 8;
    var mesh = new FSS.Mesh(geometry, material);
    var now, start = Date.now();

    function initialise() {
      scene.add(mesh);
      scene.add(light);
      scene.add(light2);
      container.appendChild(renderer.element);
      window.addEventListener('resize', resize);

    }
    // Create Mesh
    function createMesh() {
      renderer.clear();
      // Augment vertices for animation
      var v, vertex;
      for (v = geometry.vertices.length - 1; v >= 0; v--) {
        vertex = geometry.vertices[v];
        vertex.anchor = FSS.Vector3.clone(vertex.position);
        vertex.step = FSS.Vector3.create(
          Math.randomInRange(0.2, 1.0),
          Math.randomInRange(0.2, 1.0),
          Math.randomInRange(0.2, 1.0)
        );
        vertex.time = Math.randomInRange(0, Math.PIM2);
      }
    }


    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
    var posX=0;
    var posY=0;
    $("body").mousemove(function(e) {
        posX = e.pageX;
        posY = e.pageY;
    })
    function animate() {
      now = Date.now() - start;
      var agora = now*0.001;
      // Posicao do mouse
      light.setPosition(posX-(container.offsetWidth/2),-posY+(container.offsetHeight/2), 60);
      update();
      renderer.render(scene);
      requestAnimationFrame(animate);
    }

    function update() {
        var ox, oy, oz, l, light, v, vertex, offset = depth/2;
        // Animate Vertices
        for (v = geometry.vertices.length - 1; v >= 0; v--) {
          vertex = geometry.vertices[v];
          ox = Math.sin(vertex.time + vertex.step[0] * now * speed);
          oy = Math.cos(vertex.time + vertex.step[1] * now * speed);
          oz = Math.sin(vertex.time + vertex.step[2] * now * speed);
          FSS.Vector3.set(vertex.position,
            xRange*geometry.segmentWidth*ox,
            yRange*geometry.sliceHeight*oy,
            zRange*offset*oz - offset);
          FSS.Vector3.add(vertex.position, vertex.anchor);
        }

        // Set the Geometry to dirty
        geometry.dirty = true;
      }


    initialise();
    // Create Mesh
    createMesh();
    resize();
    animate();
    update();
