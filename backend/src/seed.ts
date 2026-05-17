import { connectDB } from './config/database';
import './models';
import { hashPassword } from './services/auth.service';
import { User } from './models/User';
import { Lead } from './models/Lead';

const seed = async (): Promise<void> => {
  await connectDB();

  const adminEmail = 'admin@smartleads.local';
  const salesEmail = 'sales@smartleads.local';

  const adminPassword = await hashPassword('Admin1234!');
  const salesPassword = await hashPassword('Sales1234!');

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
  }

  let sales = await User.findOne({ email: salesEmail });
  if (!sales) {
    sales = await User.create({
      name: 'Sales User',
      email: salesEmail,
      password: salesPassword,
      role: 'sales',
    });
  }

  const leads = [
    { name: 'Rahul Sharma', email: 'rahul@leadexample.com', status: 'New', source: 'Website', userId: sales._id },
    { name: 'Maya Patel', email: 'maya@leadexample.com', status: 'Contacted', source: 'Instagram', userId: sales._id },
    { name: 'John Doe', email: 'john@leadexample.com', status: 'Qualified', source: 'Referral', userId: sales._id },
  ];

  for (const lead of leads) {
    const exists = await Lead.findOne({ email: lead.email });
    if (!exists) {
      await Lead.create(lead);
    }
  }

  console.log('✅ Seed complete');
  console.log('Admin login: admin@smartleads.local / Admin1234!');
  console.log('Sales login: sales@smartleads.local / Sales1234!');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});