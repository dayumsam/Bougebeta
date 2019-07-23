const url = 'http://localhost:3000/coordinates';

fetch(url, {mode: 'cors'})
  .then(data => {return data.json})
  .then(res => {console.log(res)})
