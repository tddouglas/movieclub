# MovieClub

todo:

1. Create Movie Club History Page
    - Season attendance with stacked bar chart. Can hover over entries for more details.
    - Lifetime attendance with stacked bar chart (might need to remove labels from bar chart if it gets too crowded)
    - Things to fix in history page
      - [x]Data not showing up after refresh. Only displays in chart after toggle for some reason. Maybe related to
      composable
        - []Theres weird sizing on charts depending on # of items. Because # of items isn't consistent, need to make
          sure
          width and heigh are always the same
          - [x]Something wrong with filtering on season. Need to review filtering logic
        - []If I can somehow fix it, need to adjust right chart expansion transition logic
        - []Add loading items to the charts before the data renders.
2. [x] Improve mobile menu
   - Move hamburger SVG into assets
3. Admin Console to automatically log movies via:
    - See [Admin Poll Create Process]() below
4. Should probably at Phone Number as a column at some point either for phone number based authentication or for
   ability to tie to movie club text chat
   < Version 1 Release >
5. Live vote tracking in nominations to see who voted for what film. 1 person voting at a time
6. Check out Ranked Choice voting
7. Need Ability to see who nominated which movie
8. Enable RLS so only logged in users can access Supabase instance
9. Nominations should have past movie club votes with all options and their ultimate outcomes.
10. Add current selection order
11. Add Movie Club Commandments somewhere to the website
12. Add previous award histories to the website
13. Add proper Org Chart
14. Letterboxd top for on members page
    - If Letterboxd doesn't work via their API. Could look to access info
      via [The MovieDB](https://letterboxd.com/about/film-data/)
15. Ability to generate selection order
16. Some sort of "meet the members" page?
17. Add google calendar input with calendar of club meetings
18. Implement testing framework
19. Implement deployment pipeline which auto-deploys testing framework using vercel dev/staging/prod environments

### Admin Poll Create Process

1. Create Poll
2. Close poll -> polls active = False && closed_at = time_now()
3. Create entry in `movies` Table with winner of Movie Club poll
4. Fetch current season -> `season_id`
5. Insert into `club_sessions` with season `season_id` fetched from previous step, `poll_id`, and
   `winning_movie_id` from previous step

### Selecting all movie club history

#### Option 1:

- Select `season_id` (seasons),  `poll_id`, `winning_movie_id` (club_sessions), `title`
  (movies), all users who voted in a specific poll (poll_votes) table
- Table of all previous movie winners in order below bar charts

Pros:

- Doesn't duplicate entries in the DB. Option 2, we are kinda keeping entries duplicated in club_attendance table
- 1 fewer step in the creation of a movie club entry

Cons:

- DB should reflect that we didn't actually count data properly for first 3 seasons. How to show that?
    - For backfill, reflect cast_at as null

#### Option 2:

- Utilize club_attendance table. Everytime there a poll is closed, we add that person entries into the
  `club_attendance` table

Pros:

- Easier to back fill data for past clubs which we don't have exact attendance data for. Can just create an entrty
  per user per session as many times as necessary.
    - But that is still per session so would still need to assign users to specific sessions.
- Makes it easier to tell when a session was actually "counted" on a per attendance basis vs. not by building that
  logic into

## Back fill Process

Inputs = `season_id` for season this movie club was apart of & `movie_id` for Movie that won & `date` for rough
date of movie club w/o timestamp

1. Create `polls` entry for the movie club session in question -> `polls.id`
2. Create `poll_options` entry with `poll_id`, `text`= "What Movie Should we Watch?", `created_at` = Null
3. create `club_sessions` entry w/ date, season_id, poll_id, movie_id, created_at = null
4. Output `polls.id`, `polls_options.id`, `club_sessions.id`

2nd step, for each club session in Season 1-3:
Take input of `polls`, and `poll_options_id` from previous script as well as `user_id`

1. Create `poll_votes` entry w/ `poll_option_id`, `user_id` and `poll_id` w/ `cast_at` = null
   Will need to do this manually for each user, assigning them to specific movie clubs


