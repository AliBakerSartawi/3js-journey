# 3js-journey

## Loading Models With GLTFJSX

- A problem was encountered `Encountered two children with the same key...`.
- The fix is to install the package globally &rarr; `npm i -g gltfjsx`
- Then provide the file and the directory

  ```
  $ npx gltfjsx public/duck/Duck.gltf
  # or
  $ npx gltfjsx src/models/Fox/glTF/Fox.gltf
  ```

- Don't forget to fix the path in the generated `js` file to point to the directory of the original `gltf` file

  ```js
  // in Model component
  const { nodes, materials } = useGLTF('../../duck/Duck.gltf');

  // end of file
  useGLTF.preload('../../duck/Duck.gltf');
  ```

- Another way to reference `public` directory

  ```js
  // in Model component
  const { nodes, materials } = useGLTF('./duck/Duck.gltf');

  // end of file
  useGLTF.preload('./duck/Duck.gltf');
  ```

- Or even simply `duck/Duck.gltf`
- And happy hacking!

- ## Draco
  - Converting the **Draco** compressed version of the `gltf` can be rewarding, as it has a much smaller size in the `public` directory

---

## Exporting GLTF From Blender

- Select the objects to be exported (no cameras or lights needed)
- **File** &rarr; **Export** &rarr; **GLTF 2.0**
  - Choose format... `glb` is preferred (one file only)
  - Check **remember export settings**
  - **Include** &rarr; check **Limit to: selected objects**
  - **Transform** &rarr; check **+Y: up** (because in blender, +Z is up)
  - **Geometry** &rarr; 
    - check **Apply Modifiers**
    - check **Normals**
    - check **UVs** if there are textures
    - **Materials** &rarr; **Export**
    - check **Compression**
  - Configure **Animations** if there is any
- Happy modeling!
