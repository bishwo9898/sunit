# Shutter Unit SEO launch checklist

Technical SEO is prepared in the codebase. Complete these steps after the
changes are deployed to Vercel.

## 1. Deploy and verify

- Confirm the production domain is `https://www.shutterunit.com`.
- Open these URLs and confirm each page loads:
  - `https://www.shutterunit.com/sitemap.xml`
  - `https://www.shutterunit.com/robots.txt`
  - `https://www.shutterunit.com/lubbock-wedding-photographer`
  - `https://www.shutterunit.com/lubbock-engagement-photographer`
  - `https://www.shutterunit.com/lubbock-graduation-photographer`
  - `https://www.shutterunit.com/lubbock-portrait-photographer`
- Do not add a Google verification placeholder. If Search Console gives you an
  HTML tag, copy only its verification token into a Vercel environment variable
  named `GOOGLE_SITE_VERIFICATION`, then redeploy.

## 2. Google Search Console

1. Add or open the Domain property for `shutterunit.com`.
2. In **Sitemaps**, submit `https://www.shutterunit.com/sitemap.xml`.
3. Use **URL inspection** on the homepage and each of the four Lubbock pages.
4. Choose **Test live URL**. If the result says the URL is available to Google,
   choose **Request indexing**.
5. Check **Page indexing** weekly. Investigate errors, but do not repeatedly
   request indexing for unchanged pages.
6. After several weeks, use **Performance > Search results** to find queries
   receiving impressions. Improve pages that are appearing on page two or three
   before creating many new pages.

Official help:

- [Submit a sitemap](https://support.google.com/webmasters/answer/7451001)
- [Inspect and request indexing](https://support.google.com/webmasters/answer/9012289)

## 3. Google Business Profile

The website currently describes Fortunes as based in Lubbock while existing
search results and older website copy also associate Shutter Unit with Midland.
Decide the true operating base and make it consistent everywhere.

- Use exactly one real-world business name: **Shutter Unit** or **Shutter Unit
  Photography**, whichever is used consistently in client-facing materials.
- If clients do not visit a staffed studio with permanent signage, configure the
  profile as a service-area business and hide the residential address.
- Add only accurate service areas. Google recommends keeping the overall service
  area within roughly two hours of the actual base.
- Use **Photographer** as the primary category. Add only a few accurate secondary
  categories available in the profile.
- Add separate services for wedding, engagement, graduation, portrait,
  headshot, family, branding, and event photography. Write a useful description
  for each.
- Link the profile's website field to `https://www.shutterunit.com/`.
- Add recent, real work every week. Mix weddings, couples, graduation,
  portraits, behind-the-scenes images, and short videos.
- Ask every completed client for an honest Google review using the profile's
  review link. Never offer a discount, gift, or other incentive for reviews.
- Reply naturally to every review. Do not force city or service keywords into
  every response.

Official help:

- [Improve local ranking](https://support.google.com/business/answer/7091)
- [Manage service areas](https://support.google.com/business/answer/9157481)
- [Google Business Profile guidelines](https://support.google.com/business/answer/3038177)
- [Review best practices](https://support.google.com/business/answer/3474122)

## 4. Build local authority over 90 days

### Every week

- Upload 10 to 20 strong, recent images to Google Business Profile until the
  profile has at least 100 representative photos.
- Request a review immediately after delivering each client gallery.
- Contact one relevant local venue or vendor with a genuine collaboration idea.
- Check Search Console for indexing errors and new search queries.

### Two to four times per month

Publish a real client story from a completed session. Each story should include
the client's permission, a unique narrative, useful planning details, accurate
location context, descriptive image alt text, and links to the relevant service
and contact pages. Good topics include:

- A Texas Tech graduation session with timing and crowd-planning advice
- A Lubbock engagement session with weather and location lessons
- A wedding story naming the venue, vendors, and meaningful moments
- A Midland or Odessa portrait session with useful wardrobe guidance

Do not create thin pages by swapping only a city name. Each page should help a
potential client make a real decision.

### Listings and links

- Claim accurate profiles on major platforms that clients genuinely use.
- Keep business name, phone, website, and location/service-area details
  consistent.
- Build complete profiles on wedding platforms only if wedding photography is a
  priority and the profile can be maintained.
- Ask venues, planners, florists, DJs, stylists, and local publications to
  credit and link to Shutter Unit when they publish supplied photographs.
- Avoid bulk directory packages, paid link schemes, fake reviews, and keyword
  stuffing. They can waste money or create ranking and profile risks.

## 5. Measure leads, not just rankings

Record a baseline after deployment:

- Search Console clicks and impressions
- Google Business Profile calls, website clicks, and direction requests
- Contact-form submissions
- Confirmed bookings and the source each client mentions

Review monthly. A useful SEO improvement increases qualified inquiries and
bookings; a ranking screenshot by itself does not.
