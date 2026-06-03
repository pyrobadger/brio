import { PrismaClient, LeadStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const seedLeads = [
  { name: 'Sarah Mitchell', email: 'sarah.mitchell@techcorp.com', phone: '(555) 234-5678', company: 'TechCorp Solutions', status: LeadStatus.New, notes: 'Interested in enterprise plan. Reached out via website contact form.' },
  { name: 'James Rodriguez', email: 'j.rodriguez@innovatech.io', phone: '(555) 345-6789', company: 'InnovaTech', status: LeadStatus.Contacted, notes: 'Scheduled a demo call for next week. Very promising lead.' },
  { name: 'Emily Chen', email: 'emily.chen@cloudwave.com', phone: '(555) 456-7890', company: 'CloudWave Inc', status: LeadStatus.Qualified, notes: 'Budget approved, decision expected by end of quarter.' },
  { name: 'Michael Thompson', email: 'm.thompson@nexusdigital.co', phone: '(555) 567-8901', company: 'Nexus Digital', status: LeadStatus.Converted, notes: 'Signed 12-month contract. Onboarding begins Monday.' },
  { name: 'Priya Sharma', email: 'priya@startuphub.io', phone: '(555) 678-9012', company: 'StartupHub', status: LeadStatus.Lost, notes: 'Went with a competitor. Follow up in 6 months.' },
  { name: 'David Kim', email: 'david.kim@brightpath.com', phone: '(555) 789-0123', company: 'BrightPath Analytics', status: LeadStatus.New, notes: 'Downloaded whitepaper on data analytics solutions.' },
  { name: 'Lisa Wang', email: 'l.wang@fusionlabs.tech', phone: '(555) 890-1234', company: 'Fusion Labs', status: LeadStatus.Contacted, notes: 'Left voicemail. Will try again Thursday.' },
  { name: 'Robert Garcia', email: 'robert.garcia@meridiangroup.com', phone: '(555) 901-2345', company: 'Meridian Group', status: LeadStatus.Qualified, notes: 'Needs custom integration. Technical team reviewing requirements.' },
  { name: 'Amanda Foster', email: 'a.foster@blueprintdesign.co', phone: '(555) 012-3456', company: 'Blueprint Design Co', status: LeadStatus.New, notes: 'Referred by existing customer. High potential.' },
  { name: 'Tanaka Hiroshi', email: 'tanaka.h@globalreach.jp', phone: '+81-3-1234-5678', company: 'GlobalReach Asia', status: LeadStatus.Contacted, notes: 'International prospect. Timezone coordination needed.' },
  { name: 'Jennifer Brooks', email: 'j.brooks@summitventures.com', phone: '(555) 123-4567', company: 'Summit Ventures', status: LeadStatus.Converted, notes: 'Started with pilot program, now expanding to full deployment.' },
  { name: 'Alex Petrov', email: 'alex.petrov@quantumsoft.eu', phone: '+44-20-7946-0958', company: 'QuantumSoft', status: LeadStatus.Qualified, notes: 'Evaluating three vendors. We are frontrunner. Final presentation next week.' },
  { name: 'Maria Santos', email: 'maria.santos@verdetech.br', phone: '+55-11-91234-5678', company: 'VerdeTech Solutions', status: LeadStatus.New, notes: 'Met at SaaS Connect conference. Requested product brochure.' },
  { name: 'Christopher Lee', email: 'c.lee@ironclad.security', phone: '(555) 234-5679', company: 'IronClad Security', status: LeadStatus.Lost, notes: 'Security compliance requirements not met. Need to work on SOC 2.' },
  { name: 'Natasha Ivanova', email: 'n.ivanova@sparkengine.io', phone: '(555) 345-6780', company: 'Spark Engine', status: LeadStatus.Contacted, notes: 'Sent pricing proposal. Awaiting feedback from their CFO.' },
  { name: 'Daniel Okafor', email: 'd.okafor@horizonmedia.ng', phone: '+234-801-234-5678', company: 'Horizon Media', status: LeadStatus.New, notes: 'Growing media company, interested in our analytics dashboard.' },
  { name: 'Sophie Martin', email: 'sophie.m@artisancraft.fr', phone: '+33-1-42-68-53-00', company: 'Artisan Craft', status: LeadStatus.Qualified, notes: 'Needs multilingual support. POC confirmed for next sprint.' },
  { name: 'Kevin Walsh', email: 'k.walsh@pinnaclehealth.com', phone: '(555) 456-7891', company: 'Pinnacle Health', status: LeadStatus.Converted, notes: 'Healthcare sector. HIPAA compliant deployment completed.' },
  { name: 'Rachel Green', email: 'r.green@mosaicstudio.com', phone: '(555) 567-8902', company: 'Mosaic Studio', status: LeadStatus.New, notes: 'Creative agency looking for project management integration.' },
  { name: 'Thomas Müller', email: 't.muller@alpinetech.de', phone: '+49-89-1234-5678', company: 'AlpineTech GmbH', status: LeadStatus.Lost, notes: 'Budget constraints. Suggested to revisit next fiscal year.' },
  { name: 'Olivia Taylor', email: 'o.taylor@crescentfinance.com', phone: '(555) 678-9013', company: 'Crescent Finance', status: LeadStatus.Contacted, notes: 'Financial services. Compliance review in progress.' },
  { name: 'Hassan Ali', email: 'h.ali@oasisventures.ae', phone: '+971-4-123-4567', company: 'Oasis Ventures', status: LeadStatus.New, notes: 'Dubai-based startup accelerator. Interested in bulk licensing.' },
  { name: 'Carla Reyes', email: 'c.reyes@luminahealth.mx', phone: '+52-55-1234-5678', company: 'Lumina Health', status: LeadStatus.Qualified, notes: 'Telehealth platform. Integration with their existing EHR needed.' },
  { name: 'Nathan Scott', email: 'n.scott@vertexai.com', phone: '(555) 789-0124', company: 'Vertex AI Labs', status: LeadStatus.Converted, notes: 'AI research lab. Using our API extensively. Upgraded to premium.' },
  { name: 'Ashley Morgan', email: 'a.morgan@terragreen.eco', phone: '(555) 890-1235', company: 'TerraGreen Energy', status: LeadStatus.Contacted, notes: 'Sustainability focused. Interested in carbon tracking features.' },
];

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clear existing data
  await prisma.lead.deleteMany();
  console.log('  Cleared existing leads.');

  // Create leads with staggered dates for realistic data
  const now = new Date();
  for (let i = 0; i < seedLeads.length; i++) {
    const createdAt = new Date(now.getTime() - (seedLeads.length - i) * 24 * 60 * 60 * 1000 * Math.random() * 3);
    await prisma.lead.create({
      data: {
        ...seedLeads[i],
        createdAt,
      },
    });
  }

  console.log(`  ✅ Created ${seedLeads.length} leads.`);

  // Print summary
  const stats = await prisma.lead.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  console.log('\n  📊 Lead Distribution:');
  stats.forEach((s) => {
    console.log(`     ${s.status}: ${s._count.status}`);
  });

  console.log('\n🎉 Seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
