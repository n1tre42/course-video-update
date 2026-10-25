import { getUser } from '@netlify/identity'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { attempts, progress } from '../../db/schema.js'
import { courses } from '../../src/lib/courses.js'
import { questions, pickQuestions, isCorrect } from '../../src/lib/questions.js'
const json = (value: unknown, status = 200) =>
  Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } })
export default async (req: Request) => {
  try {
    const user = await getUser()
    if (!user)
      return json({ error: 'Please sign in to save your learning.' }, 401)
    if (req.method === 'GET') {
      const done = await db
        .select({ lessonId: progress.lessonId })
        .from(progress)
        .where(eq(progress.userId, user.id))
      const history = await db
        .select()
        .from(attempts)
        .where(eq(attempts.userId, user.id))
        .orderBy(desc(attempts.startedAt))
        .limit(30)
      return json({ completed: done.map((x) => x.lessonId), attempts: history })
    }
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
    if (
      req.headers.get('origin') &&
      req.headers.get('origin') !== new URL(req.url).origin
    )
      return json({ error: 'Invalid origin' }, 403)
    const body = (await req.json()) as Record<string, unknown>
    if (body.action === 'complete') {
      if (
        typeof body.lessonId !== 'string' ||
        !courses.some((c) => c.lessons.some((l) => l.id === body.lessonId))
      )
        return json({ error: 'Unknown lesson' }, 400)
      await db
        .insert(progress)
        .values({ userId: user.id, lessonId: body.lessonId })
        .onConflictDoNothing()
      return json({ ok: true })
    }
    if (body.action === 'start') {
      const course = courses.find((c) => c.id === body.courseId)
      if (!course) return json({ error: 'Unknown course' }, 400)
      const [active] = await db
        .select()
        .from(attempts)
        .where(
          and(
            eq(attempts.userId, user.id),
            eq(attempts.courseId, course.id),
            isNull(attempts.finishedAt),
          ),
        )
        .orderBy(desc(attempts.startedAt))
        .limit(1)
      if (active) return json(active)
      const [attempt] = await db
        .insert(attempts)
        .values({
          id: crypto.randomUUID(),
          userId: user.id,
          courseId: course.id,
          questionIds: pickQuestions(course.id, course.examCount).map(
            (q) => q.id,
          ),
          answers: {},
          deadline: new Date(Date.now() + 50 * 60 * 1000),
        })
        .returning()
      return json(attempt)
    }
    if (typeof body.id !== 'string')
      return json({ error: 'Invalid attempt' }, 400)
    const [attempt] = await db
      .select()
      .from(attempts)
      .where(and(eq(attempts.id, body.id), eq(attempts.userId, user.id)))
      .limit(1)
    if (!attempt) return json({ error: 'Attempt not found' }, 404)
    if (body.action === 'answer') {
      if (
        attempt.finishedAt ||
        new Date(attempt.deadline).getTime() <= Date.now()
      )
        return json(
          { error: 'Exam time has ended. Submit your saved answers.' },
          409,
        )
      const question = questions.find(
        (q) => q.id === body.questionId && attempt.questionIds.includes(q.id),
      )
      const answer = body.answer
      if (
        !question ||
        !Array.isArray(answer) ||
        answer.length > question.options.length ||
        !answer.every(
          (x) => Number.isInteger(x) && x >= -1 && x < question.options.length,
        )
      )
        return json({ error: 'Invalid answer' }, 400)
      if (question.type === 'single' && answer.length > 1)
        return json({ error: 'Choose one answer' }, 400)
      if (
        question.type !== 'matching' &&
        new Set(answer).size !== answer.length
      )
        return json({ error: 'Duplicate answer' }, 400)
      const patch = JSON.stringify({ [question.id]: answer })
      const updated = await db
        .update(attempts)
        .set({ answers: sql`${attempts.answers} || ${patch}::jsonb` })
        .where(
          and(
            eq(attempts.id, attempt.id),
            isNull(attempts.finishedAt),
            sql`${attempts.deadline} > now()`,
          ),
        )
        .returning({ id: attempts.id })
      if (!updated.length)
        return json(
          { error: 'Exam time has ended. Submit your saved answers.' },
          409,
        )
      return json({ ok: true })
    }
    if (body.action === 'finish') {
      if (attempt.finishedAt) return json(attempt)
      const correct = attempt.questionIds.reduce((n, id) => {
        const q = questions.find((q) => q.id === id)
        return n + (q && isCorrect(q, attempt.answers[id]) ? 1 : 0)
      }, 0)
      const [finished] = await db
        .update(attempts)
        .set({
          finishedAt: new Date(),
          score: Math.round((correct / attempt.questionIds.length) * 100),
        })
        .where(and(eq(attempts.id, attempt.id), isNull(attempts.finishedAt)))
        .returning()
      return json(finished ?? attempt)
    }
    return json({ error: 'Unknown action' }, 400)
  } catch {
    return json(
      {
        error: 'The learning service is temporarily unavailable. Please retry.',
      },
      503,
    )
  }
}
export const config = { path: '/api/learning' }
