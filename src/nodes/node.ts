import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import { Value } from "../types";

export async function node(
  nodeId: number, // the ID of the node
  N: number, // total number of nodes in the network
  F: number, // number of faulty nodes in the network
  initialValue: Value, // initial value of the node
  isFaulty: boolean, // true if the node is faulty, false otherwise
  nodesAreReady: () => boolean, // used to know if all nodes are ready to receive requests
  setNodeIsReady: (index: number) => void // this should be called when the node is started and ready to receive requests
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());


  // Route to retrieve the current status of the node
  node.get("/status", (req, res) => {
    if (isFaulty) {
      res.status(500).send("faulty");
    } else {
      res.status(200).send("live");
    }
  });

  // Route to get the current state of a node
  node.get("/getState", (req, res) => {
    // Create NodeState object representing the current state of the node
    const nodeState = {
      killed: false, // Placeholder value for killed property
      x: isFaulty ? null : initialValue, // Set consensus value to initialValue if node is not faulty
      decided: null, // Placeholder value for decided property
      k: null // Placeholder value for k property
    };
    // Respond with the current state of the node
    res.json(nodeState);
  });

  // TODO implement this
  // this route allows retrieving the current status of the node
  // node.get("/status", (req, res) => {});

  // TODO implement this
  // this route allows the node to receive messages from other nodes
  // node.post("/message", (req, res) => {});

  // TODO implement this
  // this route is used to start the consensus algorithm
  // node.get("/start", async (req, res) => {});

  // TODO implement this
  // this route is used to stop the consensus algorithm
  // node.get("/stop", async (req, res) => {});

  // TODO implement this
  // get the current state of a node
  // node.get("/getState", (req, res) => {});

  // start the server
  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(
      `Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`
    );

    // the node is ready
    setNodeIsReady(nodeId);
  });

  return server;
}
