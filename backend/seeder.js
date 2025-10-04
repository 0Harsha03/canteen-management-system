const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');
const MenuItem = require('./models/Menu');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@canteen.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210'
  },
  {
    name: 'Kitchen Staff',
    email: 'staff@canteen.com', 
    password: 'staff123',
    role: 'staff',
    phone: '9876543211'
  },
  {
    name: 'John Student',
    email: 'john@student.edu',
    password: 'student123',
    role: 'customer',
    phone: '9876543212',
    studentId: 'ST2024001'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@student.edu',
    password: 'student123',
    role: 'customer',
    phone: '9876543213',
    studentId: 'ST2024002'
  }
];

// College canteen menu items - realistic and simple
const menuItems = [
  // Breakfast Items
  {
    name: 'Idli Sambar',
    description: 'Soft steamed rice cakes served with sambar and coconut chutney',
    category: 'breakfast',
    price: 25,
    preparationTime: 5,
    isVegetarian: true,
    isVegan: false,
    ingredients: ['Rice', 'Urad Dal', 'Sambar', 'Coconut Chutney'],
    availability: {
      isAvailable: true,
      availableFrom: '07:00',
      availableTo: '10:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 50, lowStockThreshold: 10 },
    tags: ['south-indian', 'healthy', 'light']
  },
  {
    name: 'Poha',
    description: 'Flattened rice cooked with onions, mustard seeds, and curry leaves',
    category: 'breakfast',
    price: 20,
    preparationTime: 5,
    isVegetarian: true,
    isVegan: true,
    ingredients: ['Poha', 'Onions', 'Curry Leaves', 'Mustard Seeds'],
    availability: {
      isAvailable: true,
      availableFrom: '07:00',
      availableTo: '10:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 40, lowStockThreshold: 8 },
    tags: ['maharashtrian', 'light', 'quick']
  },
  {
    name: 'Bread Omelette',
    description: 'Two slices of bread with fluffy omelette',
    category: 'breakfast',
    price: 30,
    preparationTime: 8,
    isVegetarian: false,
    spiceLevel: 'mild',
    ingredients: ['Bread', 'Eggs', 'Onions', 'Green Chilies'],
    availability: {
      isAvailable: true,
      availableFrom: '07:00',
      availableTo: '10:30',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 30, lowStockThreshold: 5 },
    tags: ['protein', 'filling']
  },

  // Lunch Items
  {
    name: 'Dal Rice',
    description: 'Steamed rice served with yellow lentil curry and pickle',
    category: 'lunch',
    price: 40,
    preparationTime: 5,
    isVegetarian: true,
    isVegan: true,
    ingredients: ['Rice', 'Toor Dal', 'Turmeric', 'Onions', 'Tomatoes'],
    availability: {
      isAvailable: true,
      availableFrom: '12:00',
      availableTo: '15:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 100, lowStockThreshold: 20 },
    tags: ['comfort-food', 'filling', 'protein']
  },
  {
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with tender chicken pieces and spices',
    category: 'lunch',
    price: 120,
    preparationTime: 15,
    isVegetarian: false,
    spiceLevel: 'medium',
    ingredients: ['Basmati Rice', 'Chicken', 'Biryani Spices', 'Onions', 'Yogurt'],
    availability: {
      isAvailable: true,
      availableFrom: '12:00',
      availableTo: '15:00',
      daysOfWeek: ['tuesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 25, lowStockThreshold: 5 },
    tags: ['non-veg', 'special', 'spicy']
  },
  {
    name: 'Veg Thali',
    description: 'Complete meal with rice, roti, dal, vegetable curry, pickle, and papad',
    category: 'lunch',
    price: 80,
    preparationTime: 5,
    isVegetarian: true,
    ingredients: ['Rice', 'Roti', 'Dal', 'Seasonal Vegetables', 'Pickle', 'Papad'],
    availability: {
      isAvailable: true,
      availableFrom: '12:00',
      availableTo: '15:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 60, lowStockThreshold: 15 },
    tags: ['complete-meal', 'value', 'traditional']
  },

  // Snacks
  {
    name: 'Samosa',
    description: 'Crispy triangular pastry filled with spiced potatoes and peas',
    category: 'snacks',
    price: 15,
    preparationTime: 3,
    isVegetarian: true,
    spiceLevel: 'mild',
    ingredients: ['Flour', 'Potatoes', 'Peas', 'Spices'],
    availability: {
      isAvailable: true,
      availableFrom: '10:00',
      availableTo: '18:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 80, lowStockThreshold: 15 },
    tags: ['fried', 'popular', 'tea-time']
  },
  {
    name: 'Sandwich',
    description: 'Grilled vegetable sandwich with cheese and chutneys',
    category: 'snacks',
    price: 35,
    preparationTime: 8,
    isVegetarian: true,
    ingredients: ['Bread', 'Mixed Vegetables', 'Cheese', 'Mint Chutney'],
    availability: {
      isAvailable: true,
      availableFrom: '10:00',
      availableTo: '18:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 40, lowStockThreshold: 8 },
    tags: ['grilled', 'healthy', 'filling']
  },
  {
    name: 'Maggi',
    description: 'Instant noodles cooked with vegetables and spices',
    category: 'snacks',
    price: 25,
    preparationTime: 10,
    isVegetarian: true,
    spiceLevel: 'mild',
    ingredients: ['Instant Noodles', 'Mixed Vegetables', 'Maggi Masala'],
    availability: {
      isAvailable: true,
      availableFrom: '15:00',
      availableTo: '20:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 60, lowStockThreshold: 12 },
    tags: ['instant', 'student-favorite', 'quick']
  },

  // Beverages
  {
    name: 'Chai',
    description: 'Fresh brewed Indian tea with milk and spices',
    category: 'beverages',
    price: 10,
    preparationTime: 5,
    isVegetarian: true,
    ingredients: ['Tea Leaves', 'Milk', 'Sugar', 'Cardamom', 'Ginger'],
    availability: {
      isAvailable: true,
      availableFrom: '07:00',
      availableTo: '20:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 200, lowStockThreshold: 30 },
    tags: ['hot', 'refreshing', 'all-time']
  },
  {
    name: 'Fresh Lime Water',
    description: 'Refreshing lime water with mint and salt',
    category: 'beverages',
    price: 15,
    preparationTime: 3,
    isVegetarian: true,
    isVegan: true,
    ingredients: ['Fresh Lime', 'Water', 'Mint', 'Salt', 'Sugar'],
    availability: {
      isAvailable: true,
      availableFrom: '10:00',
      availableTo: '18:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 100, lowStockThreshold: 20 },
    tags: ['refreshing', 'summer', 'healthy']
  },
  {
    name: 'Coffee',
    description: 'Hot filter coffee with milk and sugar',
    category: 'beverages',
    price: 12,
    preparationTime: 5,
    isVegetarian: true,
    ingredients: ['Coffee Powder', 'Milk', 'Sugar'],
    availability: {
      isAvailable: true,
      availableFrom: '07:00',
      availableTo: '20:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 150, lowStockThreshold: 25 },
    tags: ['hot', 'energizing', 'morning']
  },

  // Desserts
  {
    name: 'Gulab Jamun',
    description: 'Sweet milk dumplings soaked in rose-flavored syrup (2 pieces)',
    category: 'desserts',
    price: 20,
    preparationTime: 2,
    isVegetarian: true,
    ingredients: ['Milk Powder', 'Sugar Syrup', 'Rose Water', 'Cardamom'],
    availability: {
      isAvailable: true,
      availableFrom: '12:00',
      availableTo: '20:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 40, lowStockThreshold: 8 },
    tags: ['sweet', 'traditional', 'festival']
  },
  {
    name: 'Ice Cream Cup',
    description: 'Vanilla ice cream cup',
    category: 'desserts',
    price: 25,
    preparationTime: 1,
    isVegetarian: true,
    ingredients: ['Milk', 'Sugar', 'Vanilla'],
    availability: {
      isAvailable: true,
      availableFrom: '12:00',
      availableTo: '20:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    stock: { quantity: 50, lowStockThreshold: 10 },
    tags: ['cold', 'creamy', 'summer']
  }
];

// Import data
const importData = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await MenuItem.deleteMany();

    console.log('👥 Creating users...');
    let createdUsers = [];
    
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      console.log(`   ✅ ${user.name} (${user.role})`);
    }

    // Get admin user to assign as creator
    const adminUser = createdUsers.find(user => user.role === 'admin');

    console.log('🍽️  Creating menu items...');
    for (const itemData of menuItems) {
      const menuItem = await MenuItem.create({
        ...itemData,
        createdBy: adminUser._id
      });
      console.log(`   ✅ ${menuItem.name} - ₹${menuItem.price}`);
    }

    console.log('\n🎉 Data imported successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@canteen.com / admin123');
    console.log('Staff: staff@canteen.com / staff123'); 
    console.log('Student: john@student.edu / student123');
    console.log('Student: sarah@student.edu / student123');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    console.log('🗑️  Deleting all data...');
    await User.deleteMany();
    await MenuItem.deleteMany();
    console.log('✅ Data deleted successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}