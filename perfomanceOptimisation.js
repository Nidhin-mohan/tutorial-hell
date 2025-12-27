const mongoose = require('mongoose');

// ================== SETUP ==================
const MONGO_URI = 'mongodb://127.0.0.1:27017/performance_test';

const UserSchema = new mongoose.Schema({ name: String });
const OrderSchema = new mongoose.Schema({
    amount: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
});

const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);

// ================== DB CONNECTION ==================
async function connectDB() {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
}

// ================== SEEDING ==================
async function clearDatabase() {
    await User.deleteMany({});
    await Order.deleteMany({});
}

async function seedUsers(count = 1000) {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({ name: `User ${i}` });
    }
    return User.insertMany(users);
}

async function seedOrders(users) {
    const orders = users.map(user => ({
        userId: user._id,
        amount: Math.floor(Math.random() * 100)
    }));
    await Order.insertMany(orders);
}

async function seedDatabase() {
    console.log('🌱 Seeding database with 1000 users and orders...');
    await clearDatabase();
    const users = await seedUsers();
    await seedOrders(users);
    console.log('✅ Seeding complete. Starting benchmark...\n');
}

// ================== BENCHMARK TESTS ==================
async function nPlusOneTest() {
    console.time('❌ N+1 Loop Method');

    const users = await User.find();
    const result = [];

    for (const user of users) {
        const order = await Order.findOne({ userId: user._id });
        result.push({
            user: user.name,
            orderAmount: order ? order.amount : 0
        });
    }

    console.timeEnd('❌ N+1 Loop Method');
}

async function inOperatorTest() {
    console.time('✅ $in Operator Method');

    const users = await User.find();
    const userIds = users.map(u => u._id);

    const orders = await Order.find({ userId: { $in: userIds } });

    const result = users.map(user => {
        const order = orders.find(
            o => o.userId.toString() === user._id.toString()
        );
        return {
            user: user.name,
            orderAmount: order ? order.amount : 0
        };
    });

    console.timeEnd('✅ $in Operator Method');
}

// ================== CLEANUP ==================
async function closeDB() {
    await mongoose.connection.close();
    console.log('\nDone! Notice the huge difference in milliseconds?');
}

// ================== MAIN ==================
async function main() {
    await connectDB();
    await seedDatabase();
    await nPlusOneTest();
    await inOperatorTest();
    await closeDB();
}

main().catch(console.error);
