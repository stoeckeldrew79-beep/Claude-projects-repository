import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import * as CategoriesModel from '../models/categories';

export async function list(_req: AuthedRequest, res: Response) {
  const categories = await CategoriesModel.listCategories();
  res.json({ data: categories });
}

export async function getBySlug(req: AuthedRequest, res: Response) {
  const category = await CategoriesModel.getCategoryBySlug(req.params.slug);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json({ data: category });
}
