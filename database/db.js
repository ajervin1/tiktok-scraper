import {Sequelize} from 'sequelize'
import {fileURLToPath} from 'url';
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

// Create a new instance of Sequelize


export const db = new Sequelize(  {
  dialect: 'sqlite',
  host: path.resolve(__dirname, 'tiktoks.sqlite'),
  logging: false,
});

// Export the connection
