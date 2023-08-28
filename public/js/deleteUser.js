function deleteUser(uid){
    fetch(`/api/session/${uid}/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .then(async response => {
        const data = await response.json();
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