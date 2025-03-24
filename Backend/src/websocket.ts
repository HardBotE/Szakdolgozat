import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import {createMessage, findAllMessageSessionsWS, findOneMessageSession} from "./Controller/messageController";

console.log("✅ WebSocket szerver indul...");

const PORT = Number(process.env.WS_PORT) || 5000;
const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WebSocket szerver fut: ws://localhost:${PORT}`);

const clients = new Map<string, WebSocket>();

wss.on("connection", async (ws: WebSocket, req) => {
    console.log("🔗 Új WebSocket kapcsolat próbál csatlakozni...");

    const url = new URL(req.url || "", `ws://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
        console.log("❌ Hiányzó token. Kapcsolat elutasítva.");
        ws.close(1008, "Missing authentication token");
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        ws.userId = decoded.id;

        clients.set(ws.userId, ws);
        console.log(`✅ Felhasználó csatlakozott: ${ws.userId}`);

        const sessions = await findAllMessageSessionsWS(ws.userId);

        ws.send(JSON.stringify({ type: "messages", data: sessions }));

        ws.on("message", async (data) => {
            try {
                const parsed = JSON.parse(data.toString());

                switch (parsed.type) {
                    case 'getMessages':


                        const session = await findOneMessageSession(parsed.userId, ws.userId);

                        console.log('-*--------------------------------');
                        // @ts-ignore
                        console.log(JSON.stringify(session.messages));
                        if (!session) {
                            ws.send(JSON.stringify({ type: 'no_messages', data: [] }));
                        } else {
                            // @ts-ignore
                            ws.send(JSON.stringify({ type: 'messages', data: session.messages }));
                        }
                        break;

                    case 'sendMessage': // 📩 Üzenet küldése
                        const { receiverId, message } = parsed;

                        if (!receiverId || !message) return;

                        const conversation = await createMessage(ws.userId, receiverId, message);
                        const newMessage = conversation.messages[conversation.messages.length - 1];

                        ws.send(JSON.stringify({ type: 'new_message', data: newMessage }));

                        const receiverSocket = clients.get(receiverId);
                        if (receiverSocket) {
                            receiverSocket.send(JSON.stringify({ type: 'new_message', data: newMessage }));
                        }
                        break;

                    default:
                        console.warn("⚠️ Ismeretlen WebSocket esemény:", parsed.type);
                }
            } catch (error) {
                console.error("❌ Hiba a WebSocket üzenet feldolgozásakor:", error);
            }
        });


        ws.on("close", () => {
            console.log(`❌ Kapcsolat bontva: ${ws.userId}`);
            clients.delete(ws.userId);
        });

    } catch (error) {
        console.log("❌ Hibás vagy lejárt token.");
        ws.close(1008, "Invalid authentication token");
    }
});
