import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet';
import compression from 'compression';

import healthRoutes from './routes/health.routes.js'

console.log("hello from 7birds");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.get('/', (_, res) => {
  res.send('7birds API');
});

app.use('/api/health', healthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
