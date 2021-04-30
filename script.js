const baseUrl = "https://res.cloudinary.com/tedsvintageart/image/upload"
const folder = "Maps"
const images = [{
  id: 1862,
  label: "Horizontal",
  orientation: "horizontal",
  heightAt400Width: 237,
}, {
  id: 5191,
  label: "Vertical",
  orientation: "vertical",
  heightAt400Width: 584,
}, {
  id: 3451,
  label: "Square-ish",
  orientation: "square",
  heightAt400Width: 430,
}]

function createH2(text) {
  const h2 = document.createElement("h2")
  h2.innerText = text
  return h2
}

function generateImgs(targetNode, transforms) {
  images.forEach(image => {
    targetNode.appendChild(createH2(image.label))

    const img = document.createElement("img")
    img.src = `${baseUrl}/${transforms.join(',')},h_${image.heightAt400Width}/${folder}/${image.id}.jpg`
    targetNode.appendChild(img)
  })
}

// ***************************
// Basic images
// ***************************
const base = document.querySelector("#base")
generateImgs(base, ["w_400"])

// ***************************
//         Canvases
// ***************************
function getCanvasUrl(image) {
  // TODO: get image dimensions programmatically
  // QUESTION: do you already have logic for cropping? (we can just use that)
  const {id, heightAt400Width} = image
  const imageTranforms = [
    "w_400",
    `h_${heightAt400Width}`,
    "c_fill",
  ]
  const edgeLayer = [
    ...imageTranforms,
    `l_${folder}:${id}`, // create overlay
    "o_60", // reduced opacity
    "bo_1px_solid_rgb:FFFFFF", // solid white border
  ].join(",")
  const edgeRight = [
    "w_20",
    `h_${heightAt400Width}`,
    "c_crop", // crop to the small width
    "g_east", // use the east side of the image
  ].join(",")
  const edgeBottom = [
    "w_400",
    "h_20",
    "c_crop",
    "g_south"
  ].join(",")
  // flip / distort / apply to overlay and place on right/east side
  const flipAndDistortRight = `/a_hflip/e_distort:0:0:20:20:20:${heightAt400Width + 20}:0:${heightAt400Width}/x_-20,y_9,g_east,fl_layer_apply`
  // flip / distort / apply to overlay and place on bottom/south side
  const flipAndDistortBottom = `/a_vflip/e_distort:0:0:400:0:420:20:20:20/y_1,g_south,fl_layer_apply`
  return `${baseUrl}/${imageTranforms.join(",")}/${edgeLayer}/${edgeRight}${flipAndDistortRight}/${edgeLayer}/${edgeBottom}${flipAndDistortBottom}/f_auto/q_auto/${folder}/${id}.jpg`
}

// Variables version
// https://res.cloudinary.com/demo/image/upload/$w_700,$h_500,$dp_20,$wadp_$w_add_$dp,$hadp_$h_add_$dp/w_$w,h_$h,c_fill/w_$w,h_$h,c_fill,l_art-creative-graffiti,o_60,bo_1px_solid_rgb:FFFFFF/w_$dp,h_$h,c_crop,g_east/a_hflip/e_distort:0:0:$dp:$dp:$dp:$hadp:0:$h/x_$dp_mul_-1,g_north_east,fl_layer_apply/w_$w,h_$h,c_fill,l_art-creative-graffiti,o_60,bo_1px_solid_rgb:FFFFFF/w_$w,h_$dp,c_crop,g_south/a_vflip/e_distort:0:0:$w:0:$wadp:$dp:$dp:$dp/g_south,fl_layer_apply/f_auto,q_auto/art-creative-graffiti.png

function generateCanvases(targetNode) {
  images.forEach(image => {
    targetNode.appendChild(createH2(image.label))

    const img = document.createElement("img")
    img.src = getCanvasUrl(image)
    targetNode.appendChild(img)
  })
}

const canvases = document.querySelector("#canvases")
generateCanvases(canvases)


// ***************************
//   Tilted canvases
// ***************************

// Constants
const EDGE_WIDTH = 10
const MAP_WIDTH = 800
const ASPECT_RATIO = {
  small_axis: 2,
  large_axis: 3,
}

function getTiltedCanvasUrl(image) {
  // https://res.cloudinary.com/tedsvintageart/image/upload/v1619797612/Overlays/light-gray-background.jpg
  const {id, orientation} = image
  let displayHeight = MAP_WIDTH
  if (orientation === "horizontal") {
    displayHeight = Math.round(MAP_WIDTH * ASPECT_RATIO.small_axis / ASPECT_RATIO.large_axis)
  } else if (orientation === "vertical") {
    displayHeight = Math.round(MAP_WIDTH * ASPECT_RATIO.large_axis / ASPECT_RATIO.small_axis)
  }

  const skewedWidth = Math.round(MAP_WIDTH * 0.9)
  const leftRightMargin = (MAP_WIDTH + EDGE_WIDTH - skewedWidth) / 2
  // from top left to top right to bottom right to bottom left
  const skews = [
    leftRightMargin, 20,
    MAP_WIDTH - leftRightMargin, 40,
    MAP_WIDTH - leftRightMargin, displayHeight - 40,
    leftRightMargin, displayHeight - 20,
  ].join(":")

  const variables = [
    `$w_${MAP_WIDTH}`, // map width
    `$h_${displayHeight}`, // map height
    `$d_${EDGE_WIDTH}`, // display width/depth of canvas edge
  ].join(",")

  const imageTranforms = [
    "w_$w",
    `h_$h`,
    "b_rgb:eee",
    "c_scale",
    "e_shadow",
    `e_distort:${skews}`,
  ].join(",")

  const edgeLayer = [
    "w_$w",
    `h_$h`,
    "e_brightness:-60",
    `l_${folder}:${id}`, // create overlay
    "o_60", // reduced opacity
    // "bo_1px_solid_rgb:FFFFFF", // solid white border
  ].join(",")
  const edgeLeft = [
    "w_5",
    `h_$h`,
    "c_crop", // crop to the small width
    "g_west", // use the west side of the image
  ].join(",")
  // flip / distort / apply to overlay and place on left/west side
  const flipAndDistortLeft = `/a_hflip/e_distort:0:$d:$d:0:$d:${displayHeight - 40}:0:${displayHeight - 60}/x_${leftRightMargin - EDGE_WIDTH},y_20,g_west,fl_layer_apply`

  // flip / distort / apply to overlay and place on bottom/south side
  return `${baseUrl}/${variables}/${imageTranforms}/${edgeLayer}/${edgeLeft}${flipAndDistortLeft}/f_auto/q_auto/${folder}/${id}.jpg`
}

function generateTiltedCanvases(targetNode) {
  images.forEach(image => {
    targetNode.appendChild(createH2(image.label))

    const img = document.createElement("img")
    img.src = getTiltedCanvasUrl(image)
    targetNode.appendChild(img)
  })
}

const tiltedCanvases = document.querySelector("#tilted")
generateTiltedCanvases(tiltedCanvases)


// ***************************
//   Flat canvases
// ***************************

// New Constants
const IMAGE_WIDTH = 1500
const IMAGE_HEIGHT = 1000
const BACKGROUND_FOLDER = "Overlays"
const BACKGROUNDS = {
  square: {
    file: "canvas-square.jpg",
    width: 620,
    height: 620,
  },
  horizontal: {
    file: "canvas-horizontal.jpg",
    width: 790,
    height: 565,
    x: 357,
    y: 217,
  },
  vertical: {
    file: "canvas-vertical.jpg",
    width: 552,
    height: 772,
  },
}

function getFlatCanvasUrl(image) {
  const {id, orientation} = image

  const mapWidth = BACKGROUNDS[orientation].width
  const mapHeight = BACKGROUNDS[orientation].height
  const backgroundImage = BACKGROUNDS[orientation].file
  const x = Math.round(IMAGE_WIDTH - mapWidth / 2)
  const y = Math.round(IMAGE_HEIGHT - mapHeight / 2)

  const backgroundTranforms = [
    `w_${IMAGE_WIDTH}`,
    `h_${IMAGE_HEIGHT}`,
    "c_fit",
  ].join(",")

  const mapLayer = [
    `l_${folder}:${id}`,
    `w_${mapWidth}`,
    `h_${mapHeight}`,
    "c_scale",
  ].join(",")

  return `${baseUrl}/${backgroundTranforms}/${mapLayer}/f_auto/q_auto/${BACKGROUND_FOLDER}/${backgroundImage}`
}

function generateFlatCanvases(targetNode) {
  images.forEach(image => {
    targetNode.appendChild(createH2(image.label))

    const img = document.createElement("img")
    img.src = getFlatCanvasUrl(image)
    targetNode.appendChild(img)
  })
}

const flatCanvases = document.querySelector("#flat-canvas")
generateFlatCanvases(flatCanvases)
