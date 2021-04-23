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

const base = document.querySelector("#base")
const baseUrl = "https://res.cloudinary.com/tedsvintageart/image/upload"
const folder = "Maps"

images.forEach(image => {
  const h2 = document.createElement("h2")
  h2.innerText = image.label
  base.appendChild(h2)

  const img = document.createElement("img")
  img.src = `${baseUrl}/w_400/${folder}/${image.id}.jpg`
  base.appendChild(img)
})
