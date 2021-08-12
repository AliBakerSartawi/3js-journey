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
    const { nodes, materials } = useGLTF('../../duck/Duck.gltf')

    // end of file
    useGLTF.preload('../../duck/Duck.gltf')
    ```

  - Another way to reference `public` directory

    ```js
    // in Model component
    const { nodes, materials } = useGLTF('./duck/Duck.gltf')

    // end of file
    useGLTF.preload('./duck/Duck.gltf')
    ```

  - Or even simply `duck/Duck.gltf`

  - And happy hacking!