import { Request, Response } from 'express';

export const getExampleData = (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
};