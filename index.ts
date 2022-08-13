import express from "express";
import { webhookCallback } from "grammy";
import { http} from "@serverless/cloud";
const  errorHandler = require('node-error-handler');

import bot from './bot'

const app = express(); 
app.use(express.json());
app.use(errorHandler({ debug: true, trace: app.get('env') === 'development' }));

app.use(webhookCallback(bot, "express"));

http.use(app);
