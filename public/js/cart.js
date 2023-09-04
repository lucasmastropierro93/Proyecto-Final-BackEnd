// console.log("cart");

function generateTicket(cartId) {
  
    fetch(`/api/carts/${cartId}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(async response => {
      const data = await response.json();
      console.log(data)
      if (response.ok) {
          return data
      } else {
          throw data.error;
      }
    })
    .then(data => {
      alert(data.message)
      location.reload()
    })
    .catch(error => {
      console.log('Error: ' + error)
    });
  }

