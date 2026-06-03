import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🚀 CRM Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Leads API: http://localhost:${PORT}/api/leads`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
