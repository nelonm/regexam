"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
const newAddress = zod_1.z.object({
    address: zod_1.z.string(),
    password: zod_1.z.string(),
    password2: zod_1.z.string()
});
const loadDB = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawData = yield promises_1.default.readFile(`${__dirname}/../database/${filename}.json`, 'utf-8');
        const data = JSON.parse(rawData);
        return data;
    }
    catch (error) {
        return null;
    }
});
const saveDB = (filename, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileContent = JSON.stringify(data);
        yield promises_1.default.writeFile(`${__dirname}/../database/${filename}.json`, fileContent);
        return true;
    }
    catch (error) {
        return false;
    }
});
server.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = newAddress.safeParse(req.body);
    if (!result.success)
        return res.status(400).json(result.error.issues);
    const newUser = result.data;
    const users = yield loadDB("users");
    if (!users)
        return res.sendStatus(500);
    for (const user of users) {
        if (user.address === newUser.address)
            return res.status(400).json("A felhsználónév foglalt");
    }
    const id = Math.random();
    const isSuccessful = yield saveDB("users", [...users, Object.assign(Object.assign({}, newUser), { id })]);
    if (!isSuccessful)
        return res.sendStatus(500);
    res.json(Object.assign(Object.assign({}, newUser), { id }));
}));
server.listen(4200);
