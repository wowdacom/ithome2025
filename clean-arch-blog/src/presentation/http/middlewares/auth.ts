import { Request, Response, NextFunction } from 'express';
import { supabasePublic } from '../../../config/supabase';

export async function auth(req: Request, res: Response, next: NextFunction) {
  // 每次執行時檢查環境變數（支援測試環境）
  if (process.env.DISABLE_AUTH === 'true') {
    return next();
  }

  if (!supabasePublic) {
    return res.status(500).json({ error: 'Auth not configured' });
  }

  const header = req.headers['authorization'];
  if (!header || !header.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  const token = header.slice(7).trim();
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });

  const { data, error } = await supabasePublic.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  // 附加 user 給後續使用
  (req as any).user = data.user;
  return next();
}
