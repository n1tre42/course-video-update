import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core'
export const progress = pgTable(
  'lesson_progress',
  {
    userId: text('user_id').notNull(),
    lessonId: text('lesson_id').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
)
export const attempts = pgTable('exam_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  courseId: text('course_id').notNull(),
  questionIds: jsonb('question_ids').$type<string[]>().notNull(),
  answers: jsonb('answers')
    .$type<Record<string, number[]>>()
    .notNull()
    .default({}),
  startedAt: timestamp('started_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deadline: timestamp('deadline', { withTimezone: true }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  score: integer('score'),
})
