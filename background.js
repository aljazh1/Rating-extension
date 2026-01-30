chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchRT") {
        const query = encodeURIComponent(request.title);
        const searchUrl = `https://www.rottentomatoes.com/search?search=${query}`;
        const targetYear = request.year ? request.year.replace(/[^0-9]/g, '') : "";

        // determines link type: "tv" for series, "m" for movies
        const typeSegment = request.isTv ? "tv" : "m";
        
        console.log(`Searching RT for: ${request.title} (Type: ${typeSegment.toUpperCase()})`);

        fetch(searchUrl)
            .then(response => response.text())
            .then(html => {
                const linkRegex = new RegExp(`href="(https:\\/\\/www\\.rottentomatoes\\.com\\/${typeSegment}\\/[^"]+)"[^>]*>([^<]+)`, "g");
                
                let match;
                let bestUrl = null;

                while ((match = linkRegex.exec(html)) !== null) {
                    const foundUrl = match[1];
                    // search for year matching
                    const foundText = match[0] + (html.substring(match.index, match.index + 300));
                    
                    if (targetYear && foundText.includes(targetYear)) {
                        bestUrl = foundUrl;
                        break;
                    }
                    if (!bestUrl) bestUrl = foundUrl; 
                }

                if (bestUrl) {
                    console.log(`Fetching Page: ${bestUrl}`);
                    return fetch(bestUrl);
                } else {
                    throw new Error("Content not found in search results.");
                }
            })
            .then(response => response.text())
            .then(movieHtml => {
                // extract and clean score
                const cleanScore = (str) => str ? str.replace(/%| /g, "").trim() : "N/A";

                let criticMatch = movieHtml.match(/slot="critics-score"[^>]*>([^<]+)</);
                let audienceMatch = movieHtml.match(/slot="audience-score"[^>]*>([^<]+)</);
                
                let criticScore = criticMatch ? cleanScore(criticMatch[1]) : "N/A";
                let audienceScore = audienceMatch ? cleanScore(audienceMatch[1]) : "N/A";

                console.log(`Scores Found - Critic: ${criticScore}, Audience: ${audienceScore}`);
                
                sendResponse({ 
                    criticScore: criticScore, 
                    audienceScore: audienceScore 
                });
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                sendResponse({ criticScore: "N/A", audienceScore: "N/A" });
            });

        return true; 
    }
});