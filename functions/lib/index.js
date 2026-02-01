"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
firebase_admin_1.default.initializeApp();
const db = firebase_admin_1.default.firestore();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://atom-ng-challenge.vercel.app",
        "http://localhost:4200",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
// API Endpoints
app.get("/users/:email", async (req, res) => {
    const snapshot = await db
        .collection("users")
        .where("email", "==", decodeURIComponent(req.params.email))
        .get();
    if (snapshot.empty)
        return res.status(404).send();
    return res.json(Object.assign({ id: snapshot.docs[0].id }, snapshot.docs[0].data()));
});
app.post("/users", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).send("Email is required");
        const newUser = {
            email: email,
            createdAt: new Date().toISOString(),
        };
        const doc = await db.collection("users").add(newUser);
        return res.status(201).json(Object.assign({ id: doc.id }, newUser));
    }
    catch (error) {
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
    res.json(snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data()))));
});
app.post("/tasks", async (req, res) => {
    const task = Object.assign(Object.assign({}, req.body), { createdAt: new Date().toISOString(), completed: false });
    const doc = await db.collection("tasks").add(task);
    res.status(201).json(Object.assign({ id: doc.id }, task));
});
app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await db.collection("tasks").doc(id).update(data);
        res.status(200).send(Object.assign({ id }, req.body));
    }
    catch (error) {
        res.status(500).send({ message: "Error al actualizar", error });
    }
});
app.delete("/tasks/:id", async (req, res) => {
    await db.collection("tasks").doc(req.params.id).delete();
    res.status(204).send();
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map