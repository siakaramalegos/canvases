const baseUrl = "https://res.cloudinary.com/tedsvintageart/image/upload"
const folder = "Maps"
const images = [{
  id: 1862,
  label: "Horizontal",
  orientation: "horizontal",
}, {
  id: 5191,
  label: "Vertical",
  orientation: "vertical",
}, {
  id: 3451,
  label: "Square-ish",
  orientation: "square",
}]

function createH2(text) {
  const h2 = document.createElement("h2")
  h2.innerText = text
  return h2
}

// ***************************
//   Tilted canvases
// ***************************

// Constants
const IMAGE_WIDTH = 1500
const IMAGE_HEIGHT = 1000
const BG_FILE = "light-gray-background.jpg"
const BG_FOLDER = "Overlays"
// This has the flat files but the width and height numbers are useful here too
const BACKGROUNDS = {
  square: {
    file: "canvas-square.jpg",
    width: 620,
    height: 620,
    tiltMultiplier: 1.4,
  },
  horizontal: {
    file: "canvas-horizontal.jpg",
    width: 790,
    height: 565,
    tiltMultiplier: 1.5,
  },
  vertical: {
    file: "canvas-vertical.jpg",
    width: 552,
    height: 772,
    tiltMultiplier: 1.15,
  },
}
const EDGE_WIDTH = 10
const MAP_WIDTH = 800
const ASPECT_RATIO = {
  small_axis: 2,
  large_axis: 3,
}


function getTiltedCanvasUrl(image) {
  const {id, orientation} = image
  const mapWidth = BACKGROUNDS[orientation].width * BACKGROUNDS[orientation].tiltMultiplier
  const mapHeight = BACKGROUNDS[orientation].height * BACKGROUNDS[orientation].tiltMultiplier

  const skewedWidth = Math.round(mapWidth * 0.9)
  const leftRightMargin = Math.round((mapWidth + EDGE_WIDTH - skewedWidth) / 2)
  // from top left to top right to bottom right to bottom left
  const skews = [
    leftRightMargin, 20,
    mapWidth - leftRightMargin, 40,
    mapWidth - leftRightMargin, mapHeight - 40,
    leftRightMargin, mapHeight - 20,
  ].join(":")

  const variables = [
    `$w_${mapWidth}`, // map width
    `$h_${mapHeight}`, // map height
    `$d_${EDGE_WIDTH}`, // display width/depth of canvas edge
  ].join(",")

  const imageTranforms = [
    `w_${IMAGE_WIDTH}`,
    `h_${IMAGE_HEIGHT}`,
    "c_crop",
  ].join(",")

  const mapTranforms = [
    `l_${folder}:${id}`, // create overlay
    "w_$w",
    `h_$h`,
    "c_scale",
    `e_distort:${skews}`,
  ].join(",")

  const edgeLayer = [
    "w_$w",
    `h_$h`,
    "e_brightness:-60", // make darker
    `l_${folder}:${id}`, // create overlay
    "o_60", // reduced opacity
  ].join(",")
  const edgeLeft = [
    "w_5",
    `h_$h`,
    "c_crop", // crop to the small width
    "g_west", // use the west side of the image
  ].join(",")
  // flip / distort / apply to overlay and place on left/west side
  const flipAndDistortLeft = `/a_hflip/e_distort:0:$d:$d:0:$d:${mapHeight - 40}:0:${mapHeight - 60}/x_${leftRightMargin - EDGE_WIDTH},y_20,g_west,fl_layer_apply`

  // flip / distort / apply to overlay and place on bottom/south side
  return `${baseUrl}/${variables}/${imageTranforms}/${mapTranforms}/${edgeLayer}/${edgeLeft}${flipAndDistortLeft}/f_auto/q_auto/${BG_FOLDER}/${BG_FILE}`
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

  return `${baseUrl}/${backgroundTranforms}/${mapLayer}/f_auto/q_auto/${BG_FOLDER}/${backgroundImage}`
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
