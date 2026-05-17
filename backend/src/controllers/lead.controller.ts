import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createLead, deleteLead, findLeadById, listLeads, updateLead } from '../services/lead.service';
import { format } from 'fast-csv';

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, source, search, sort, page, limit } = req.query;
  const result = await listLeads({
    status: status as string | undefined,
    source: source as string | undefined,
    search: search as string | undefined,
    sort: sort as string | undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    userId: req.user?.id,
    isAdmin: req.user?.role === 'admin',
  });
  res.json({ success: true, message: 'Leads fetched', data: result });
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await findLeadById(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }

  if (req.user?.role !== 'admin' && lead.userId.toString() !== req.user?.id) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }

  res.json({ success: true, message: 'Lead fetched', data: lead });
};

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await createLead({ ...req.body, userId: req.user!.id });
  res.status(201).json({ success: true, message: 'Lead created', data: lead });
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await findLeadById(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }

  if (req.user?.role !== 'admin' && lead.userId.toString() !== req.user?.id) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }

  const updated = await updateLead(lead._id.toString(), req.body);
  res.json({ success: true, message: 'Lead updated', data: updated });
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await findLeadById(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }

  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }

  await deleteLead(lead._id.toString());
  res.json({ success: true, message: 'Lead deleted' });
};

export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await listLeads({
    status: req.query.status as string | undefined,
    source: req.query.source as string | undefined,
    search: req.query.search as string | undefined,
    sort: req.query.sort as string | undefined,
    limit: 1000,
    page: 1,
    userId: req.user?.id,
    isAdmin: req.user?.role === 'admin',
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');

  const csvStream = format({ headers: true });
  csvStream.pipe(res);
  result.data.forEach((lead) => {
    csvStream.write({
      id: lead._id,
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      userId: lead.userId,
      createdAt: lead.createdAt,
    });
  });
  csvStream.end();
};