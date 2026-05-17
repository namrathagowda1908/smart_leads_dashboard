import { Types } from 'mongoose';
import { Lead, ILead } from '../models/Lead';
import { User } from '../models/User';

export const findLeadById = async (id: string): Promise<ILead | null> => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Lead.findById(id);
};

export const createLead = async (data: { name: string; email: string; status: string; source: string; userId: string }): Promise<ILead> => {
  return Lead.create(data);
};

export const updateLead = async (id: string, data: Partial<{ name: string; email: string; status: string; source: string }>): Promise<ILead | null> => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Lead.findByIdAndUpdate(id, data, { new: true });
};

export const deleteLead = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) return false;
  const result = await Lead.findByIdAndDelete(id);
  return !!result;
};

export const listLeads = async (params: {
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
  page?: number;
  limit?: number;
  userId?: string;
  isAdmin?: boolean;
}): Promise<{ data: ILead[]; meta: any }> => {
  const { page = 1, limit = 10, search, status, source, sort, userId, isAdmin } = params;
  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) query.status = status;
  if (source) query.source = source;
  if (!isAdmin && userId) {
    if (Types.ObjectId.isValid(userId)) {
      query.userId = new Types.ObjectId(userId);
    }
  }

  const sortOrder = sort === 'oldest' ? 1 : -1;

  const count = await Lead.countDocuments(query);
  const data = await Lead.find(query)
    .sort({ createdAt: sortOrder })
    .limit(limit)
    .skip((page - 1) * limit);

  return {
    data,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNextPage: page * limit < count,
      hasPrevPage: page > 1,
    },
  };
};