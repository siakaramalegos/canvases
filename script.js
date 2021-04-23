function generateImgs(targetNode, transforms) {
  const baseUrl = "https://res.cloudinary.com/tedsvintageart/image/upload"
  const folder = "Maps"
  const images = [{
    id: 1862,
    label: "Horizontal",
  }, {
    id: 5191,
    label: "Vertical",
  }, {
    id: 3451,
    label: "Square-ish"
  }]

  images.forEach(image => {
    const h2 = document.createElement("h2")
    h2.innerText = image.label
    targetNode.appendChild(h2)

    const img = document.createElement("img")
    img.src = `${baseUrl}/${transforms}/${folder}/${image.id}.jpg`
    targetNode.appendChild(img)
  })
}

const base = document.querySelector("#base")
generateImgs(base, "w_400")
