import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'stories.db');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    age TEXT NOT NULL,
    gender TEXT NOT NULL,
    interests TEXT NOT NULL,
    style TEXT NOT NULL,
    lesson TEXT NOT NULL,
    story TEXT NOT NULL,
    image1 TEXT,
    image2 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export function saveStory(storyData) {
  const stmt = db.prepare(`
    INSERT INTO stories (age, gender, interests, style, lesson, story, image1, image2)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    storyData.age,
    storyData.gender,
    JSON.stringify(storyData.interests),
    storyData.style,
    storyData.lesson,
    storyData.story,
    storyData.image1 || null,
    storyData.image2 || null
  );
  
  return result.lastInsertRowid;
}

export function getAllStories() {
  const stmt = db.prepare(`
    SELECT * FROM stories ORDER BY created_at DESC
  `);
  
  const stories = stmt.all();
  
  return stories.map(story => ({
    ...story,
    interests: JSON.parse(story.interests)
  }));
}

export function getStoryById(id) {
  const stmt = db.prepare('SELECT * FROM stories WHERE id = ?');
  const story = stmt.get(id);
  
  if (story) {
    story.interests = JSON.parse(story.interests);
  }
  
  return story;
}

export function deleteStory(id) {
  const stmt = db.prepare('DELETE FROM stories WHERE id = ?');
  return stmt.run(id);
}

export default db;