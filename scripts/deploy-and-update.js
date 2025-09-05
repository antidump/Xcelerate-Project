const { execSync } = require('child_process');
const fs = require('fs');

async function main() {
  console.log('🚀 Starting Complete Deployment and Update Process...');
  
  try {
    // Step 1: Compile contracts
    console.log('\n📦 Step 1: Compiling contracts...');
    execSync('npx hardhat compile', { stdio: 'inherit' });
    console.log('✅ Contracts compiled successfully');

    // Step 2: Deploy contracts
    console.log('\n🚀 Step 2: Deploying contracts...');
    execSync('npx hardhat run scripts/deploy-complete.js --network xlayer-testnet', { stdio: 'inherit' });
    console.log('✅ Contracts deployed successfully');

    // Step 3: Update frontend addresses
    console.log('\n🔄 Step 3: Updating frontend addresses...');
    execSync('node scripts/update-frontend-addresses.js', { stdio: 'inherit' });
    console.log('✅ Frontend addresses updated');

    // Step 4: Restart dev server
    console.log('\n🔄 Step 4: Restarting dev server...');
    console.log('Please restart your dev server manually:');
    console.log('1. Stop current dev server (Ctrl+C)');
    console.log('2. Run: npm run dev');
    console.log('3. Test token creation');

    console.log('\n🎉 Deployment process completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- All contracts deployed to X Layer Testnet');
    console.log('- Registry initialized with all addresses');
    console.log('- Frontend addresses updated');
    console.log('- Ready to create tokens! 🚀');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

main();

