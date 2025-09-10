import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'

dotenv.config()

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await User.deleteMany({})
    await Event.deleteMany({})
    await Registration.deleteMany({})

    // Create Admin User
    console.log('👤 Creating admin user...')
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bitmesra.ac.in',
      password: 'admin123',
      role: 'admin',
      department: 'Administration',
      isVerified: true,
      preferences: {
        emailNotifications: true,
        smsNotifications: true
      }
    })
    console.log('✅ Admin user created:', admin.email)

    // Create Sample Students
    console.log('👥 Creating sample students...')
    const students = await User.create([
      {
        name: 'John Doe',
        email: 'john.doe@bitmesra.ac.in',
        password: 'student123',
        role: 'student',
        studentId: '20BCS001',
        department: 'Computer Science & Engineering',
        year: 3,
        phone: '+91-9876543210',
        isVerified: true
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@bitmesra.ac.in',
        password: 'student123',
        role: 'student',
        studentId: '20BEC002',
        department: 'Electronics & Communication Engineering',
        year: 3,
        phone: '+91-9876543211',
        isVerified: true
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@bitmesra.ac.in',
        password: 'student123',
        role: 'student',
        studentId: '20BME003',
        department: 'Mechanical Engineering',
        year: 2,
        phone: '+91-9876543212',
        isVerified: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@bitmesra.ac.in',
        password: 'student123',
        role: 'student',
        studentId: '20BCE004',
        department: 'Civil Engineering',
        year: 4,
        phone: '+91-9876543213',
        isVerified: true
      }
    ])
    console.log(`✅ Created ${students.length} sample students`)

    // Create Sample Events
    console.log('🎯 Creating sample events...')
    const now = new Date()
    const events = await Event.create([
      {
        title: 'Technical Symposium 2024',
        description: 'Annual technical symposium featuring innovative projects and research presentations from various engineering departments. This is a premier event that brings together students, faculty, and industry experts.',
        shortDescription: 'Annual technical symposium with project presentations and industry experts.',
        category: 'Technical',
        tags: ['technology', 'innovation', 'research', 'engineering'],
        organizer: admin._id,
        organizerInfo: {
          name: admin.name,
          email: admin.email,
          department: admin.department,
          contact: '+91-9876543200'
        },
        venue: {
          name: 'Main Auditorium',
          address: 'BIT Mesra Campus, Ranchi',
          capacity: 500
        },
        dateTime: {
          start: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 hours later
          registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
        },
        registration: {
          isRequired: true,
          maxParticipants: 500,
          currentParticipants: 245,
          fee: 0,
          fields: [
            { name: 'department', type: 'select', required: true, options: ['CSE', 'ECE', 'ME', 'CE'] },
            { name: 'year', type: 'select', required: true, options: ['1', '2', '3', '4'] }
          ]
        },
        status: 'published',
        visibility: 'public',
        targetAudience: ['all'],
        images: [{
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
          caption: 'Technical Symposium 2024',
          isPrimary: true
        }],
        requirements: ['Valid student ID', 'Registration confirmation'],
        prizes: [
          { position: '1st Place', prize: 'Certificate + ₹10,000', value: 10000 },
          { position: '2nd Place', prize: 'Certificate + ₹5,000', value: 5000 },
          { position: '3rd Place', prize: 'Certificate + ₹3,000', value: 3000 }
        ]
      },
      {
        title: 'Cultural Night - Bitotsav',
        description: 'Grand cultural celebration with music, dance, and entertainment. Experience the vibrant culture of BIT Mesra with performances by students and special guests.',
        shortDescription: 'Grand cultural celebration with music, dance, and entertainment.',
        category: 'Cultural',
        tags: ['culture', 'music', 'dance', 'entertainment'],
        organizer: admin._id,
        organizerInfo: {
          name: admin.name,
          email: admin.email,
          department: admin.department,
          contact: '+91-9876543200'
        },
        venue: {
          name: 'Open Air Theatre',
          address: 'BIT Mesra Campus, Ranchi',
          capacity: 1000
        },
        dateTime: {
          start: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          end: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 hours later
          registrationDeadline: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000) // 8 days from now
        },
        registration: {
          isRequired: true,
          maxParticipants: 1000,
          currentParticipants: 892,
          fee: 0
        },
        status: 'published',
        visibility: 'public',
        targetAudience: ['all'],
        images: [{
          url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=400&fit=crop',
          caption: 'Cultural Night - Bitotsav',
          isPrimary: true
        }]
      },
      {
        title: 'Sports Meet 2024',
        description: 'Inter-college sports competition across multiple disciplines including cricket, football, basketball, volleyball, and track & field events.',
        shortDescription: 'Inter-college sports competition across multiple disciplines.',
        category: 'Sports',
        tags: ['sports', 'competition', 'athletics'],
        organizer: admin._id,
        organizerInfo: {
          name: admin.name,
          email: admin.email,
          department: admin.department,
          contact: '+91-9876543200'
        },
        venue: {
          name: 'Sports Complex',
          address: 'BIT Mesra Campus, Ranchi',
          capacity: 300
        },
        dateTime: {
          start: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
          end: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000), // 3 days event
          registrationDeadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000) // 12 days from now
        },
        registration: {
          isRequired: true,
          maxParticipants: 300,
          currentParticipants: 156,
          fee: 100,
          fields: [
            { name: 'sport', type: 'select', required: true, options: ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Athletics'] },
            { name: 'experience', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] }
          ]
        },
        status: 'published',
        visibility: 'public',
        targetAudience: ['all'],
        images: [{
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
          caption: 'Sports Meet 2024',
          isPrimary: true
        }]
      },
      {
        title: 'Hackathon - CodeCrush',
        description: '48-hour coding marathon to build innovative solutions for real-world problems. Teams will compete to create the most innovative and technically sound project.',
        shortDescription: '48-hour coding marathon to build innovative solutions.',
        category: 'Technical',
        tags: ['coding', 'hackathon', 'innovation', 'programming'],
        organizer: admin._id,
        organizerInfo: {
          name: admin.name,
          email: admin.email,
          department: admin.department,
          contact: '+91-9876543200'
        },
        venue: {
          name: 'Computer Center',
          address: 'BIT Mesra Campus, Ranchi',
          capacity: 100
        },
        dateTime: {
          start: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
          end: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000), // 2 days event
          registrationDeadline: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000) // 18 days from now
        },
        registration: {
          isRequired: true,
          maxParticipants: 100,
          currentParticipants: 78,
          fee: 200,
          fields: [
            { name: 'team_name', type: 'text', required: true },
            { name: 'team_size', type: 'select', required: true, options: ['1', '2', '3', '4'] },
            { name: 'programming_languages', type: 'text', required: true }
          ]
        },
        status: 'published',
        visibility: 'public',
        targetAudience: ['second-year', 'third-year', 'fourth-year'],
        images: [{
          url: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800&h=400&fit=crop',
          caption: 'Hackathon - CodeCrush',
          isPrimary: true
        }],
        prizes: [
          { position: '1st Place', prize: 'Trophy + ₹50,000', value: 50000 },
          { position: '2nd Place', prize: 'Trophy + ₹30,000', value: 30000 },
          { position: '3rd Place', prize: 'Trophy + ₹20,000', value: 20000 }
        ]
      },
      {
        title: 'AI/ML Workshop',
        description: 'Hands-on workshop on machine learning fundamentals and applications. Learn about neural networks, deep learning, and practical AI implementation.',
        shortDescription: 'Hands-on workshop on machine learning fundamentals.',
        category: 'Workshop',
        tags: ['AI', 'machine learning', 'workshop', 'technology'],
        organizer: admin._id,
        organizerInfo: {
          name: admin.name,
          email: admin.email,
          department: admin.department,
          contact: '+91-9876543200'
        },
        venue: {
          name: 'AI Lab',
          address: 'CSE Department, BIT Mesra',
          capacity: 60
        },
        dateTime: {
          start: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
          end: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
          registrationDeadline: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000) // 23 days from now
        },
        registration: {
          isRequired: true,
          maxParticipants: 60,
          currentParticipants: 45,
          fee: 300,
          fields: [
            { name: 'programming_experience', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
            { name: 'preferred_language', type: 'select', required: true, options: ['Python', 'R', 'Java', 'C++'] }
          ]
        },
        status: 'published',
        visibility: 'public',
        targetAudience: ['second-year', 'third-year', 'fourth-year'],
        images: [{
          url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop',
          caption: 'AI/ML Workshop',
          isPrimary: true
        }]
      }
    ])
    console.log(`✅ Created ${events.length} sample events`)

    // Create some sample registrations
    console.log('📝 Creating sample registrations...')
    const registrations = []
    
    // Register some students for events
    for (let i = 0; i < 2; i++) {
      registrations.push(await Registration.create({
        user: students[i]._id,
        event: events[0]._id, // Technical Symposium
        status: 'confirmed',
        registrationData: {
          department: students[i].department.split(' ')[0],
          year: students[i].year.toString()
        }
      }))
    }

    // Update user registeredEvents
    await User.findByIdAndUpdate(students[0]._id, {
      $push: { registeredEvents: events[0]._id }
    })
    await User.findByIdAndUpdate(students[1]._id, {
      $push: { registeredEvents: events[0]._id }
    })

    console.log(`✅ Created ${registrations.length} sample registrations`)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📋 Sample Accounts Created:')
    console.log('👤 Admin Account:')
    console.log('   Email: admin@bitmesra.ac.in')
    console.log('   Password: admin123')
    console.log('\n👥 Student Accounts:')
    students.forEach(student => {
      console.log(`   Email: ${student.email}`)
      console.log('   Password: student123')
    })

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Database connection closed')
    process.exit(0)
  }
}

seedData()
