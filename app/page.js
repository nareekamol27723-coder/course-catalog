import { Suspense } from "react";
import { connection } from "next/server";
import { pool } from "@/lib/db";
import AddCourseForm from "./add-course-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b-4 border-cyan-300 bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 text-white shadow-xl">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <p className="mb-3 inline-flex rounded-full border border-cyan-200/40 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-cyan-100">
            DIT312 · WEB APPLICATION DEVELOPMENT
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Course <span className="text-cyan-300">Catalog</span>
          </h1>

          <p className="mt-3 text-sm text-violet-100 sm:text-base">
            ระบบจัดการรายวิชา · Nareekamol Khadkhew · รหัสนักศึกษา 67038888
          </p>

          <p className="mt-1 text-xs text-cyan-100/80">
            Database: <code>6703765_mydb</code>
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
            Course Overview
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
            รายวิชาที่เปิดสอน
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            เลือกดูข้อมูลรายวิชาและเพิ่มรายวิชาใหม่ได้ด้านล่าง
          </p>
        </div>

        <Suspense
          fallback={
            <p className="rounded-2xl bg-white p-5 text-slate-500 shadow">
              กำลังโหลดรายวิชา...
            </p>
          }
        >
          <Courses />
        </Suspense>
      </section>
    </main>
  );
}

async function Courses() {
  await connection();

  const [courses] = await pool.query(
    `SELECT c.id, c.code, c.title, c.credits, c.semester, c.seats,
            i.fullname AS instructor
     FROM courses c
     JOIN instructor i ON i.id = c.instructorId
     ORDER BY c.semester, c.code`
  );

  const [instructors] = await pool.query(
    "SELECT id, fullname FROM instructor ORDER BY fullname"
  );

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <article
            key={c.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-violet-100 border-t-4 border-violet-600 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="mb-3 self-start rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-sm font-semibold text-white shadow">
              {c.code}
            </span>

            <h3 className="mb-4 text-xl font-bold text-slate-900">
              {c.title}
            </h3>

            <div className="mb-5 flex flex-wrap gap-2 text-sm">
              <span className="rounded-lg bg-violet-50 px-2.5 py-1 font-medium text-violet-800">
                {c.credits} หน่วยกิต
              </span>
              <span className="rounded-lg bg-cyan-50 px-2.5 py-1 font-medium text-cyan-800">
                ภาคเรียน {c.semester}
              </span>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                {c.seats} ที่นั่ง
              </span>
            </div>

            <div className="mt-auto border-t border-slate-200 pt-3 text-sm text-slate-500">
              ผู้สอน:{" "}
              <span className="font-semibold text-slate-700">
                {c.instructor}
              </span>
            </div>
          </article>
        ))}
      </div>

      <AddCourseForm instructors={instructors} />
    </>
  );
}