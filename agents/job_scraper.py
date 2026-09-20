import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

async def scrape_job_board(url: str) -> str:
    # Configure the browser to run headlessly
    browser_config = BrowserConfig(
        browser_type="chromium",
        headless=True,
        verbose=False
    )
    
    # Configure the crawl to bypass cache for fresh job listings
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        word_count_threshold=20 # Filter out useless short text snippets
    )
    
    # Run the crawler
    async with AsyncWebCrawler(config=browser_config) as crawler:
        print(f"🕵️  Scraping job data from: {url}...")
        result = await crawler.arun(url=url, config=run_config)
        
        if result.success:
            print("✅ Successfully scraped page.")
            # We return the markdown version, which is perfect for LLMs
            return result.markdown
        else:
            print(f"❌ Failed to scrape: {result.error_message}")
            return ""

# Test block
if __name__ == "__main__":
    # Using YCombinator's Hacker News job board as a simple test target
    test_url = "https://news.ycombinator.com/jobs"
    
    # Run the async function
    scraped_markdown = asyncio.run(scrape_job_board(test_url))
    
    # Print the first 500 characters to verify
    print("\n--- Scraped Content Preview ---\n")
    print(scraped_markdown[:500])