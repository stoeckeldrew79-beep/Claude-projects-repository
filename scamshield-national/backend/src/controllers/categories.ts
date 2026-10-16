import { AuthedRequest } from '../middleware/auth';
import * as CategoriesModel from '../models/categories';
import { asyncHandler } from '../utils/asyncHandler';

export const list = asyncHandler<AuthedRequest>(async (_req, res) => {
  const categories = await CategoriesModel.listCategories();
  res.json({ data: categories });
});

export const getBySlug = asyncHandler<AuthedRequest>(async (req, res) => {
  const category = await CategoriesModel.getCategoryBySlug(req.params.slug);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json({ data: category });
});

export const trends = asyncHandler<AuthedRequest>(async (req, res) => {
  const country = typeof req.query.country === 'string' ? req.query.country : undefined;
  const [data, meta] = await Promise.all([
    CategoriesModel.categoryReportTrends(country),
    CategoriesModel.categoryTrendsMeta(country),
  ]);
  // meta sits beside data so existing readers of `data` are unaffected.
  res.json({ data, meta });
});
