const PORT = 3000

const io = require('socket.io')(PORT)

console.log("Server running on port: "+PORT)

io.on('connection', (socket:any)=>{
    console.log("Client with id "+socket.id+" connected")
})