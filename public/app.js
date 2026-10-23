const form = document.getElementById("form-aparelho");
console.log(form);

form.addEventListener("submit", (event) => {
  event.preventDefault(); 
  console.log(document.getElementById("nome").value);
});