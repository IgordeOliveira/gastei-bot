"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grammy_1 = require("grammy");
const cloud_1 = require("@serverless/cloud");
const bot_1 = __importDefault(require("./bot"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, grammy_1.webhookCallback)(bot_1.default, "express"));
app.get('/teste', (req, res) => { return JSON.stringify({ "status": "ok" }); });
cloud_1.http.use(app);
