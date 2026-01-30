
const getImageUrl = (filename) => chrome.runtime.getURL(filename);

function getMovieData() {
    const titleElement = document.querySelector('[data-testid="hero__pageTitle"] span');
    const metadataList = document.querySelector('[data-testid="hero__pageTitle"] + ul');

    if (!titleElement) return null;

    const title = titleElement.innerText;
    
    const yearElement = document.querySelector('[data-testid="hero__pageTitle"] + ul li a');
    const year = yearElement ? yearElement.innerText : "";

    let isTv = false;
    if (metadataList) {
        const text = metadataList.innerText;
        if (text.includes("TV Series") || text.includes("Mini Series")) {
            isTv = true;
        }
    }

    console.log(`IMDb-RT: Found ${title} (${year}) - Is TV? ${isTv}`);
    return { title, year, isTv };
}

function createBadge(score, type) {
    const badge = document.createElement("div");
    badge.style.display = "flex";
    badge.style.alignItems = "center";
    badge.style.marginRight = "15px";

    
    let color = "#ccc";
    let iconHtml = '<span style="font-size: 22px; margin-right: 6px;">⚪</span>';
    
    const rating = score !== "N/A" ? parseInt(score) : null;

    if (score === "N/A" || rating === null) {
        color = "#ccc";
    } else {
        if (type === "critic") {
            // critic logic
            let iconChar = "🤢";
            if (rating >= 90) {
                iconChar = "🍅";
                color = "#F1B60E";
            }
            else if(rating >= 60) {
                iconChar = "🍅"; 
                color = "#FA320A"; 
            } else {
                iconChar = "🤢"; 
                color = "#5F9F09"; 
            }
            iconHtml = `<span style="font-size: 30px; margin-right: 6px;">${iconChar}</span>`;

        } else if (type === "audience") {
            // audience logic
            if (rating >= 90) {
                color = "#F1B60E";
                const imgUrl = getImageUrl("images/cinema.png");
                iconHtml = `<img src="${imgUrl}" alt="Verified Hot" style="height: 34px; width: auto; margin-right: 6px;">`;
            } else if (rating >= 60) {
                color = "#FA320A"; 
                iconHtml = `<span style="font-size: 30px; margin-right: 6px;">🍿</span>`;
            } else {
                color = "#ccc"; 
                iconHtml = `<span style="font-size: 30px; margin-right: 6px;">🗑️</span>`;
            }
        }
    }

    // insert dynamic HTML
    badge.innerHTML = `
        ${iconHtml}
        <span style="font-weight: 700; font-size: 24px; color: ${color};">${score === "N/A" ? "?" : score + "%"}</span>
    `;
    
    return badge;
}

function displayScores(criticScore, audienceScore) {
    const imdbRatingBlock = document.querySelector('[data-testid="hero-rating-bar__aggregate-rating"]');
    if (!imdbRatingBlock) return;

    const existing = document.getElementById("rt-scores-container");
    if (existing) existing.remove();

    // main container
    const container = document.createElement("div");
    container.id = "rt-scores-container";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center"; 
    container.style.marginRight = "20px";
    container.style.cursor = "pointer";
    container.title = "View on Rotten Tomatoes";

    // header
    const header = document.createElement("div");
    header.innerText = "ROTTEN TOMATOES";
    header.style.color = "#ADB5BD"; // Matches IMDb label color
    header.style.fontSize = "12px";
    header.style.fontWeight = "600";
    header.style.letterSpacing = "2px";
    header.style.marginBottom = "4px"; // Space between text and icons
    header.style.textTransform = "uppercase";
    header.style.fontFamily = "Roboto, Helvetica, Arial, sans-serif"; 

    // icon row
    const badgeRow = document.createElement("div");
    badgeRow.style.display = "flex";
    badgeRow.style.alignItems = "center";

    const criticBadge = createBadge(criticScore, "critic");
    const audienceBadge = createBadge(audienceScore, "audience");

    badgeRow.appendChild(criticBadge);
    badgeRow.appendChild(audienceBadge);

    container.appendChild(header);
    container.appendChild(badgeRow);

    container.onclick = () => {
        window.open(`https://www.rottentomatoes.com/search?search=${getMovieData().title}`, '_blank');
    };

    // insert left of IMDb rating
    imdbRatingBlock.parentNode.insertBefore(container, imdbRatingBlock);
}

// main execution
const movie = getMovieData();
if (movie) {
    displayScores("N/A", "N/A");

    chrome.runtime.sendMessage(
        { action: "fetchRT", title: movie.title, year: movie.year, isTv: movie.isTv },
        (response) => {
            if (response) {
                displayScores(response.criticScore, response.audienceScore);
            }
        }
    );
}