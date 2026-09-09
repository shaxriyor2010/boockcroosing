import 'dotenv/config'
import bcrypt from 'bcryptjs'
import db from './db.js'

const passwordHash = bcrypt.hashSync('BookCrossing123!', 12)
const insertUser = db.prepare('INSERT OR IGNORE INTO users (full_name, username, email, password_hash) VALUES (?, ?, ?, ?)')
insertUser.run('Amelia Rivera', 'amelia', 'amelia@example.com', passwordHash)
insertUser.run('Daniyar Karimov', 'daniyar', 'daniyar@example.com', passwordHash)
const amelia = db.prepare('SELECT id FROM users WHERE username=?').get('amelia')
const daniyar = db.prepare('SELECT id FROM users WHERE username=?').get('daniyar')
const insertBook = db.prepare('INSERT INTO books (title, author, description, genre, condition, owner_id, status) SELECT ?, ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM books WHERE title=? AND owner_id=?)')
insertBook.run('The Midnight Library', 'Matt Haig', 'Between life and death there is a library. Nora Seed discovers a chance to try the lives she could have lived.', 'Fiction', 'New', amelia.id, 'Available', 'The Midnight Library', amelia.id)
insertBook.run('Project Hail Mary', 'Andy Weir', 'A lone astronaut must save humanity and the planet after waking up millions of miles from home.', 'Sci-fi', 'Good', daniyar.id, 'Available', 'Project Hail Mary', daniyar.id)
insertBook.run('Atomic Habits', 'James Clear', 'A proven way to build good habits and break bad ones through tiny changes.', 'Self-growth', 'Good', amelia.id, 'Available', 'Atomic Habits', amelia.id)
insertBook.run('Sapiens', 'Yuval Noah Harari', 'A brief history of humankind, from the Stone Age to the age of silicon.', 'History', 'New', daniyar.id, 'Available', 'Sapiens', daniyar.id)
console.log('Seed complete. Demo password: BookCrossing123!')
db.close()
