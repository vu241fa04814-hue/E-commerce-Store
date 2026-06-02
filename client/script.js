/* Author: VIJAYKUMAR */
function displayProducts(list) {
  const container = document.getElementById("productList");

  // Use map to create an array of strings, then join them into one single string
  container.innerHTML = list
    .map(
      (product) => `
    <div class="card">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p class="price">₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add To Cart</button>
    </div>
  `,
    )
    .join(""); // .join('') removes the commas between array items
}
