
-- 1. Create Tutors table
CREATE TABLE public.tutors (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  name text NOT NULL,
  phone_number text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS on tutors
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutors can read their own profile" ON public.tutors FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Tutors can update their own profile" ON public.tutors FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public read for tutor profiles" ON public.tutors FOR SELECT USING (true);

-- 2. Create Students table
-- We generate a unique access code automatically upon insertion
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.students (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tutor_id uuid REFERENCES public.tutors(id) NOT NULL,
  name text NOT NULL,
  unique_code text UNIQUE DEFAULT substring(md5(random()::text) from 1 for 6) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS on students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
-- For tutors: can read and write only their own assigned students
CREATE POLICY "Tutors can manage their students" ON public.students FOR ALL USING (auth.uid() = tutor_id);
-- For students logging in, we'd traditionally use a custom JWT, but we can allow reading via a custom RPC function or a secure session context later on. For now, public read if they have the code:
CREATE POLICY "Students can read their profile via unique_code" ON public.students FOR SELECT USING (true); -- We will enforce the exact student lookup via our backend Edge Functions/React logic

-- 3. Create Subjects table
CREATE TABLE public.subjects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tutor_id uuid REFERENCES public.tutors(id) NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutors manage their subjects" ON public.subjects FOR ALL USING (auth.uid() = tutor_id);
CREATE POLICY "Public read for student dashboard" ON public.subjects FOR SELECT USING (true);

-- 4. Create Schedules table
CREATE TABLE public.tuition_schedules (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tutor_id uuid REFERENCES public.tutors(id) NOT NULL,
  student_id uuid REFERENCES public.students(id) NOT NULL,
  days_per_week integer DEFAULT 1,
  scheduled_time time without time zone,
  rescheduled_date date,
  routine_days jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tuition_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutors manage their schedules" ON public.tuition_schedules FOR ALL USING (auth.uid() = tutor_id);
CREATE POLICY "Public read for student schedules" ON public.tuition_schedules FOR SELECT USING (true);

-- 5. Homeworks table
CREATE TYPE public.hw_status AS ENUM ('complete', 'incomplete', 'partially_complete', 'pending');
CREATE TABLE public.homeworks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id uuid REFERENCES public.subjects(id) NOT NULL,
  student_id uuid REFERENCES public.students(id) NOT NULL,
  description text NOT NULL,
  status public.hw_status DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.homeworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutors manage their assigned homeworks" ON public.homeworks FOR ALL USING (true);
CREATE POLICY "Public read for student homeworks" ON public.homeworks FOR SELECT USING (true);

-- 6. Quizzes table
CREATE TABLE public.quizzes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id uuid REFERENCES public.subjects(id) NOT NULL,
  student_id uuid REFERENCES public.students(id) NOT NULL,
  syllabus text NOT NULL,
  total_marks integer DEFAULT 100,
  marks_obtained integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tutors manage their assigned quizzes" ON public.quizzes FOR ALL USING (true);
CREATE POLICY "Public read for student quizzes" ON public.quizzes FOR SELECT USING (true);

-- 7. Trigger to automatically create a Tutor profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.tutors (id, name, phone_number)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', ''), 
    COALESCE(new.raw_user_meta_data->>'phone_number', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
