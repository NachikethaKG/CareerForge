import asyncio
import sys
import urllib.parse
from playwright.async_api import async_playwright
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Ensure standard UTF-8 console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


async def scrape_jobs_headless(search_term: str, target_count: int = 30) -> list[dict]:
    """
    Headlessly searches Y Combinator's job board using Playwright
    and extracts job title, company, URL, and description snippet
    for the first 20-30 results.
    """
    jobs = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        encoded_term = urllib.parse.quote_plus(search_term.strip())
        waas_url = f"https://workatastartup.com/companies?query={encoded_term}"

        try:
            print(f"[LocalDiscovery] Searching jobs for '{search_term}' on {waas_url}...")
            await page.goto(waas_url, wait_until="networkidle", timeout=25000)
            await page.wait_for_timeout(2000)

            job_links = await page.query_selector_all("a[href*='/jobs/']")
            for link in job_links:
                if len(jobs) >= target_count:
                    break
                href = await link.get_attribute("href") or ""
                if not href:
                    continue
                full_url = f"https://workatastartup.com{href}" if href.startswith("/") else href

                # Extract title
                h3_el = await link.query_selector("h3")
                title = (await h3_el.inner_text()).strip() if h3_el else ""

                # Extract descriptive text elements (company, role summary, compensation/location)
                p_elements = await link.query_selector_all("p")
                p_texts = [(await p_el.inner_text()).strip() for p_el in p_elements if (await p_el.inner_text()).strip()]

                company = p_texts[0] if len(p_texts) > 0 else "YC Startup"
                comp_desc = p_texts[1] if len(p_texts) > 1 else ""
                meta_desc = p_texts[2] if len(p_texts) > 2 else ""

                if not title:
                    title = "Software Engineer"

                snippet_parts = [part for part in [company, title, comp_desc, meta_desc] if part]
                snippet = " | ".join(snippet_parts)

                jobs.append({
                    "title": title,
                    "company": company,
                    "url": full_url,
                    "description": snippet,
                    "snippet": snippet
                })
        except Exception as e:
            print(f"[LocalDiscovery] Primary scraping error: {e}")

        # Fallback to news.ycombinator.com/jobs if primary returned fewer than 5 jobs
        if len(jobs) < 5:
            try:
                print("[LocalDiscovery] Falling back to news.ycombinator.com/jobs...")
                hn_url = "https://news.ycombinator.com/jobs"
                await page.goto(hn_url, wait_until="domcontentloaded", timeout=15000)
                rows = await page.query_selector_all("tr.athing")
                for row in rows:
                    if len(jobs) >= target_count:
                        break
                    title_el = await row.query_selector(".titleline a")
                    if not title_el:
                        continue
                    t = (await title_el.inner_text()).strip()
                    u = await title_el.get_attribute("href") or ""
                    if not u.startswith("http"):
                        u = f"https://news.ycombinator.com/{u}"

                    subtext_row = await row.evaluate_handle("el => el.nextElementSibling")
                    subtext = (await subtext_row.evaluate("el => el ? el.innerText : ''")).strip()

                    company_name = t.split("Is Hiring")[0].strip() if "Is Hiring" in t else "YC Company"
                    desc = f"{t}. Posted: {subtext}" if subtext else t

                    jobs.append({
                        "title": t,
                        "company": company_name,
                        "url": u,
                        "description": desc,
                        "snippet": desc
                    })
            except Exception as e:
                print(f"[LocalDiscovery] Fallback scraping error: {e}")

        await browser.close()
    return jobs


async def discover_jobs(
    resume_text: str,
    search_term: str,
    skip: int = 0,
    limit: int = 5
) -> list[dict]:
    """
    Discovers jobs relevant to search_term using headless browser scraping,
    evaluates match against resume_text using scikit-learn TF-IDF cosine similarity,
    assigns a match percentage score to each job, sorts by highest score,
    and returns a paginated slice [skip : skip + limit].
    """
    # 1. Scrape jobs headlessly (targeting 20-30 results)
    scraped_jobs = await scrape_jobs_headless(search_term, target_count=30)

    if not scraped_jobs:
        return []

    # 2. Local NLP matching using scikit-learn TfidfVectorizer & cosine_similarity
    clean_resume = (resume_text or "").strip()
    job_descriptions = [job.get("description", "") for job in scraped_jobs]

    if clean_resume:
        corpus = [clean_resume] + job_descriptions
        try:
            vectorizer = TfidfVectorizer(stop_words="english")
            tfidf_matrix = vectorizer.fit_transform(corpus)

            # Cosine similarity between resume (index 0) and each job description (1 to N)
            similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

            for job, score in zip(scraped_jobs, similarity_scores):
                # Assign percentage score (0.0 to 100.0) rounded to 2 decimal places
                job["match_score"] = round(float(score) * 100, 2)
        except Exception as e:
            print(f"[LocalDiscovery] TF-IDF scoring fallback: {e}")
            for job in scraped_jobs:
                job["match_score"] = 0.0
    else:
        for job in scraped_jobs:
            job["match_score"] = 0.0

    # 3. Sort jobs by highest match score
    scraped_jobs.sort(key=lambda x: x["match_score"], reverse=True)

    # 4. Slice for pagination
    paginated_jobs = scraped_jobs[skip : skip + limit]
    return paginated_jobs


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

    sample_resume = """
    Full Stack Developer with 4 years of experience building scalable web applications.
    Core skills: Python, FastAPI, React, TypeScript, PostgreSQL, Docker, and REST APIs.
    Experience deploying cloud services and writing high-performance backend pipelines.
    """
    sample_search = "Python"

    print("🚀 Running local discovery test...")
    results = asyncio.run(discover_jobs(sample_resume, sample_search, skip=0, limit=5))

    print(f"\n✅ Retrieved {len(results)} jobs (page 1):")
    for idx, item in enumerate(results, 1):
        print(f"{idx}. [{item['match_score']}%] {item['title']} @ {item['company']}")
        print(f"   URL: {item['url']}")
        print(f"   Snippet: {item['snippet'][:120]}...\n")
