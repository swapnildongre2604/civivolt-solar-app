import { Router } from 'express';
import { makeCrudController } from '../controllers/crudController.js';
import { authRequired } from '../middleware/auth.js';

export function createCrudRouter(entity) {
  const c = makeCrudController(entity);
  const r = Router();

  r.use(authRequired);
  r.get('/', c.list);
  r.post('/', c.create);
  r.put('/:id', c.update);
  r.delete('/:id', c.remove);
  return r;
}
