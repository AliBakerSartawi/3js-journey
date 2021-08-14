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
    - check **Compression** (much smaller file size)
  - Configure **Animations** if there is any
- Happy modeling!

---

## Shaders

- First, package up

  ```
  $ npm i glslify babel-plugin-glsl
  ```

- Then import

  ```jsx
  import glsl from 'babel-plugin-glsl/macro';
  ```

- Important to note that the above packages didn't work with me, solution 👇

  - Simply write **GLSL** in separate dedicated files
  - Or provide them in template literals inside `jsx`

- ### GLSL Syntax Highlighting and Linting

  - Highlighting: download extension **Shader languages support for VS Code**
  - Linting: download extension **GLSL Linter** and not 🔴 _GLSL Lint_
  - Run `brew install glslang`
  - Provide the validator path in settings, as well as file extensions 👇

    ```json
    "glsl-linter.validatorPath": "/home/linuxbrew/.linuxbrew/bin/glslangValidator",
    "glsl-linter.fileExtensions": {
    ".fs.glsl": "frag",
    ".vs.glsl": "vert",
    ".tes.glsl": "tese",
    ".tcs.glsl": "tesc",
    ".gs.glsl": "geom"
    },
    ```

