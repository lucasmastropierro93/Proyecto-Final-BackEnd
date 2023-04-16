const socket = io()
socket.on('productos', data =>{
    console.log(data)
    let logs=''
    let div = document.getElementById('listaProductos')

    data.forEach(el => {
        logs += `   <li><b>ID: ${el.id}</b></li>
                    <li>Title: ${el.title}</li>
                    <li>Description: ${el.description}</li>
                    <li>Price: ${el.price}</li>
                    <li>Thumbnails: ${el.thumbnails}</li>
                    <li>Stock: ${el.stock}</li>
                    <li>Code: ${el.code}</li>
                    <hr>`
    });

    div.innerHTML=logs
})