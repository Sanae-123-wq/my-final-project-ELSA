import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('ELSA Patisserie API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
