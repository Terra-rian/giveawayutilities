import { sequelize } from './assets/sequelize';
import { donations } from './models/donations';

donations.sync();

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(() => {
    console.log('Donations database synced!');
    sequelize.close();
}).catch(console.error);