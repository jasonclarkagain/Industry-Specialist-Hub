import { Router } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { name, email, phone, message, projectType } = parsed.data;

  const [submission] = await db
    .insert(contactsTable)
    .values({
      name,
      email,
      phone: phone ?? null,
      message,
      projectType,
    })
    .returning();

  req.log.info({ submissionId: submission.id, email }, "Contact form submitted");

  res.status(201).json({
    id: submission.id,
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    message: submission.message,
    projectType: submission.projectType,
    createdAt: submission.createdAt,
  });
});

router.get("/", async (req, res) => {
  const submissions = await db
    .select()
    .from(contactsTable)
    .orderBy(desc(contactsTable.createdAt));

  res.json(
    submissions.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      message: s.message,
      projectType: s.projectType,
      createdAt: s.createdAt,
    }))
  );
});

export default router;
