const specs = [
  require('./specs/reporters.spec'),
  require('./specs/validate-list.spec'),
  require('./specs/doctor.spec'),
  require('./specs/init.spec'),
  require('./specs/parser.spec'),
  require('./specs/runner.spec')
];

(async () => {
  let failed = false;

  for (const spec of specs) {
    try {
      await spec.run();
      console.log(`✅ ${spec.name}`);
    } catch (error) {
      failed = true;
      console.error(`❌ ${spec.name}`);
      console.error(error.message);
    }
  }

  if (failed) {
    process.exit(1);
  }

  console.log('\n🎉 All tests passed.');
})();
