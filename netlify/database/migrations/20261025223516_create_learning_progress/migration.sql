CREATE TABLE "exam_attempts" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"question_ids" jsonb NOT NULL,
	"answers" jsonb DEFAULT '{}' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deadline" timestamp with time zone NOT NULL,
	"finished_at" timestamp with time zone,
	"score" integer
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"user_id" text,
	"lesson_id" text,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_progress_pkey" PRIMARY KEY("user_id","lesson_id")
);
