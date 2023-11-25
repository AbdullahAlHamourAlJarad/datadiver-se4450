"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql = __importStar(require("mssql"));
// Configuring the connection pool
const config = {
    user: 'datadiveradmin',
    password: 'ouda2023!',
    server: 'datadiverserver.database.windows.net',
    database: 'DataDiverDB',
    options: {
        encrypt: true, // For Azure SQL Database, set to true
    },
};
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a new instance of the connection pool
            const pool = yield new sql.ConnectionPool(config).connect();
            // Query example
            const result = yield pool.request().query('SELECT * FROM dbo.Customer');
            console.dir(result);
            // Close the connection pool
            pool.close();
        }
        catch (err) {
            console.error('Error occurred:', err);
        }
    });
}
// Connect to the database
connectToDatabase();
