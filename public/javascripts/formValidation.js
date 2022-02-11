const submitButton = document.querySelector('#submit-btn')

submitButton.addEventListener('click', (event) => {
  document.querySelector('#form').classList.add('was-validated')
})