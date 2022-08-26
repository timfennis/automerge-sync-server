import express from "express"
import { WebSocketServer } from "ws"
import {
  ServerRepo,
  NodeWSServerAdapter,
  NodeFSStorageAdapter,
} from "automerge-repo"

const wsServer = new WebSocketServer({ noServer: true })
const config = {
  network: [new NodeWSServerAdapter(wsServer)],
  storage: new NodeFSStorageAdapter(),
}

const PORT = 3030
const serverRepo = ServerRepo(config)
const app = express()
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.send("Hello World")
})

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request)
  })
})
