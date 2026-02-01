import * as functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(cors({
  origin: [
    "https://atom-ng-challenge.vercel.app",
    "http://localhost:4200",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


// API Endpoints
app.get("/users/:email", async (req, res) => {
  const snapshot = await db
    .collection("users")
    .where("email", "==", decodeURIComponent(req.params.email))
    .get();
  if (snapshot.empty) return res.status(404).send();
  return res.json({id: snapshot.docs[0].id, ...snapshot.docs[0].data()});
});

app.post("/users", async (req, res) => {
  try {
    const {email} = req.body;
    if (!email) return res.status(400).send("Email is required");

    const newUser = {
      email: email,
      createdAt: new Date().toISOString(),
    };
    const doc = await db.collection("users").add(newUser);
    return res.status(201).json({id: doc.id, ...newUser});
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send(error);
  }
});

app.get("/tasks/:userId", async (req, res) => {
  const snapshot = await db
    .collection("tasks")
    .where("userId", "==", req.params.userId)
    .orderBy("createdAt", "desc")
    .get();
  res.json(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})));
});

app.post("/tasks", async (req, res) => {
  const task = {
    ...req.body,
    createdAt: new Date().toISOString(),
    completed: false,
  };
  const doc = await db.collection("tasks").add(task);
  res.status(201).json({id: doc.id, ...task});
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;
    await db.collection("tasks").doc(id).update(data);
    res.status(200).send({id, ...req.body});
  } catch (error) {
    res.status(500).send({message: "Error al actualizar", error});
  }
});

app.delete("/tasks/:id", async (req, res) => {
  await db.collection("tasks").doc(req.params.id).delete();
  res.status(204).send();
});

export const api = functions.https.onRequest(app);
