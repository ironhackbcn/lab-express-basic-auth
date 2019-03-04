'use strict'

const main = () => {

}

window.addEventListener('load', main)

function validatePassword (password) {
  // Do not show anything when the length of password is zero.
  if (password.length === 0) {
    document.getElementById('msg').innerHTML = ''
    return
  }
  // Create an array and push all possible values that you want in password
  var matchedCase = []
  matchedCase.push('[A-Z]') // Uppercase Alpabates
  matchedCase.push('[0-9]') // Numbers
  matchedCase.push('[a-z]')
  // Check the conditions
  var ctr = 0
  for (var i = 0; i < password.length; i++) {
    if (new RegExp(matchedCase[i]).test(password)) {
      ctr++
    }
  }
  // Display it
  var color = ''
  var strength = ''
  switch (ctr) {
    case 0:
    case 1:
    case 2:
      strength = 'Very Weak'
      color = 'red'
      break
    case 3:
      strength = 'Medium'
      color = 'orange'
      break

    default:
      strength = 'Strong'
      color = 'green'
      break
  }
  document.getElementById('msg').innerHTML = strength
  document.getElementById('msg').style.color = color
}
