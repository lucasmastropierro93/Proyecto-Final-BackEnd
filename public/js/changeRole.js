function changeRole(uid){
    fetch(`/api/session/premium/${uid}`, {
        method: 'GET',
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
        alert('Error: ' + error)
      });
}