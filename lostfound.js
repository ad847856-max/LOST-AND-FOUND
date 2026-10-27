// CampusFind - JavaScript

const starterItems = [
    {
        id: 1,
        name: "Black Backpack",
        type: "Lost",
        category: "Accessories",
        description: "Black backpack with notebooks inside.",
        location: "Library Block",
        date: new Date().toISOString().slice(0, 10),
        contact: "",
        createdAt: Date.now() - 7200000
    },
    {
        id: 2,
        name: "Silver Phone",
        type: "Lost",
        category: "Electronics",
        description: "Silver phone with a clear case.",
        location: "CSE Building",
        date: new Date().toISOString().slice(0, 10),
        contact: "",
        createdAt: Date.now() - 14400000
    },
    {
        id: 3,
        name: "Keys with Blue Tag",
        type: "Lost",
        category: "Personal",
        description: "Keys attached to a blue keychain.",
        location: "Mess Area",
        date: new Date().toISOString().slice(0, 10),
        contact: "",
        createdAt: Date.now() - 21600000
    },
    {
        id: 4,
        name: "Brown Wallet",
        type: "Found",
        category: "Accessories",
        description: "Brown wallet found near the parking area.",
        location: "Parking Area",
        date: new Date().toISOString().slice(0, 10),
        contact: "",
        createdAt: Date.now() - 28800000
    },
    {
        id: 5,
        name: "Physics Notebook",
        type: "Found",
        category: "Books",
        description: "Notebook containing handwritten physics notes.",
        location: "Block B",
        date: new Date().toISOString().slice(0, 10),
        contact: "",
        createdAt: Date.now() - 43200000
    }
];

// Load previously saved reports
let items = loadItems();

let selectedType = "All";
let selectedCategory = "";
let searchText = "";

// Get data from localStorage
function loadItems() {
    try {
        const savedItems = localStorage.getItem("campusFindItems");

        if (savedItems) {
            const parsedItems = JSON.parse(savedItems);

            if (Array.isArray(parsedItems)) {
                return parsedItems;
            }
        }
    } catch (error) {
        console.log("Could not load saved reports.");
    }

    return starterItems;
}

// Save reports in the browser
function saveItems() {
    try {
        localStorage.setItem("campusFindItems", JSON.stringify(items));
    } catch (error) {
        showToast("Could not save reports in this browser.");
    }
}

// Choose an emoji for each item
function getEmoji(name, category) {
    const itemName = name.toLowerCase();

    if (itemName.includes("phone")) return "📱";
    if (itemName.includes("laptop")) return "💻";
    if (itemName.includes("key")) return "🔑";
    if (itemName.includes("wallet")) return "👛";
    if (itemName.includes("bag") ||
        itemName.includes("backpack")) return "🎒";
    if (itemName.includes("book") ||
        itemName.includes("notebook")) return "📒";
    if (itemName.includes("bottle")) return "🧴";
    if (itemName.includes("card") ||
        itemName.includes("id")) return "🪪";

    if (category === "Electronics") return "🔌";
    if (category === "Accessories") return "👜";
    if (category === "Books") return "📚";
    if (category === "Personal") return "🪪";

    return "📦";
}

// Prevent user-entered text from being treated as HTML
function escapeText(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return replacements[character];
    });
}

// Format the date
function formatDate(dateText) {
    if (!dateText) {
        return "Date not set";
    }

    const date = new Date(dateText + "T00:00:00");

    if (isNaN(date.getTime())) {
        return "Date not set";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });
}

// Display items on the page
function renderItems() {
    const itemGrid = document.getElementById("itemGrid");
    const emptyMessage = document.getElementById("emptyMessage");
    const sortOrder = document.getElementById("sortSelect").value;

    // Filter the items
    let filteredItems = items.filter(function(item) {
        const matchesType =
            selectedType === "All" || item.type === selectedType;

        const matchesCategory =
            selectedCategory === "" ||
            item.category === selectedCategory;

        const searchableText = (
            item.name + " " +
            item.description + " " +
            item.location + " " +
            item.category
        ).toLowerCase();

        const matchesSearch =
            searchableText.includes(searchText.toLowerCase());

        return matchesType && matchesCategory && matchesSearch;
    });

    // Sort the items by date reported
    filteredItems.sort(function(a, b) {
        if (sortOrder === "newest") {
            return b.createdAt - a.createdAt;
        }

        return a.createdAt - b.createdAt;
    });

    // Clear old cards
    itemGrid.innerHTML = "";

    // Create a card for each matching item
    filteredItems.forEach(function(item) {
        const card = document.createElement("article");
        card.className = "item-card";

        const emoji = getEmoji(item.name, item.category);

        card.innerHTML = `
            <div class="item-visual">
                <span>${emoji}</span>

                <span class="status ${item.type}">
                    ${escapeText(item.type)}
                </span>
            </div>

            <div class="item-info">
                <h3>${escapeText(item.name)}</h3>

                <p>${escapeText(item.description)}</p>

                <div class="item-meta">
                    <span>◷ ${formatDate(item.date)}</span>
                    <span>⌖ ${escapeText(item.location)}</span>
                </div>

                <button class="details-btn">
                    View Details →
                </button>
            </div>
        `;

        // Open details when the button is clicked
        card.querySelector(".details-btn").addEventListener(
            "click",
            function() {
                openDetails(item.id);
            }
        );

        itemGrid.appendChild(card);
    });

    // Show a message if nothing matches
    itemGrid.classList.toggle("hidden", filteredItems.length === 0);
    emptyMessage.classList.toggle("hidden", filteredItems.length !== 0);

    // Show active filters
    document.getElementById("filterMessage").textContent =
        (selectedCategory ? "Category: " + selectedCategory + "  " : "") +
        (searchText ? 'Search: "' + searchText + '"' : "");

    updateStats();
}

// Update the numbers on the dashboard
function updateStats() {
    const lostItems = items.filter(function(item) {
        return item.type === "Lost";
    });

    const foundItems = items.filter(function(item) {
        return item.type === "Found";
    });

    document.getElementById("lostCount").textContent =
        lostItems.length;

    document.getElementById("foundCount").textContent =
        foundItems.length;

    document.getElementById("totalCount").textContent =
        items.length;

    document.getElementById("myCount").textContent =
        items.length;
}

// Search when the search form is submitted
document.getElementById("searchForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        searchText = document.getElementById("searchInput").value.trim();

        renderItems();

        document.getElementById("listings").scrollIntoView({
            behavior: "smooth"
        });
    }
);

// Update search results as the user types
document.getElementById("searchInput").addEventListener(
    "input",
    function() {
        searchText = this.value.trim();
        renderItems();
    }
);

// Search using the popular buttons
function quickSearch(word) {
    document.getElementById("searchInput").value = word;
    searchText = word;

    renderItems();

    document.getElementById("listings").scrollIntoView({
        behavior: "smooth"
    });
}

// Change between All, Lost, and Found
function setType(type, button) {
    selectedType = type;

    document.querySelectorAll(".tab").forEach(function(tab) {
        tab.classList.remove("active");
    });

    button.classList.add("active");

    renderItems();
}

// Filter items by category
function filterCategory(category) {
    if (selectedCategory === category) {
        selectedCategory = "";
    } else {
        selectedCategory = category;
    }

    renderItems();

    document.getElementById("listings").scrollIntoView({
        behavior: "smooth"
    });
}

// Reset all filters
function resetFilters() {
    selectedType = "All";
    selectedCategory = "";
    searchText = "";

    document.getElementById("searchInput").value = "";
    document.getElementById("sortSelect").value = "newest";

    document.querySelectorAll(".tab").forEach(function(tab) {
        tab.classList.toggle(
            "active",
            tab.textContent.trim() === "All Items"
        );
    });

    renderItems();
    showToast("All filters have been cleared.");
}

// Open the report form
function openForm(type) {
    const form = document.getElementById("reportForm");

    form.reset();

    document.getElementById("itemType").value = type || "Lost";

    // Set today's date automatically
    document.getElementById("itemDate").value =
        new Date().toISOString().slice(0, 10);

    document.getElementById("reportModal").classList.remove("hidden");

    document.getElementById("itemName").focus();
}


function closeForm() {
    document.getElementById("reportModal").classList.add("hidden");
}


document.getElementById("reportForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const name = document.getElementById("itemName").value.trim();
        const description =
            document.getElementById("itemDescription").value.trim();
        const location =
            document.getElementById("itemLocation").value.trim();
        const date = document.getElementById("itemDate").value;

        if (!name || !description || !location || !date) {
            showToast("Please fill in all required fields.");
            return;
        }

        const newItem = {
            id: Date.now(),
            name: name,
            type: document.getElementById("itemType").value,
            category: document.getElementById("itemCategory").value,
            description: description,
            location: location,
            date: date,
            contact: document.getElementById("itemContact").value.trim(),
            createdAt: Date.now()
        };

        
        items.unshift(newItem);

        saveItems();
        closeForm();

        
        selectedType = "All";
        selectedCategory = "";
        searchText = "";

        document.getElementById("searchInput").value = "";

        document.querySelectorAll(".tab").forEach(function(tab) {
            tab.classList.toggle(
                "active",
                tab.textContent.trim() === "All Items"
            );
        });

        renderItems();

        showToast("Your report has been added!");

        document.getElementById("listings").scrollIntoView({
            behavior: "smooth"
        });
    }
);


function openDetails(id) {
    const item = items.find(function(entry) {
        return entry.id === id;
    });

    if (!item) {
        return;
    }

    const emoji = getEmoji(item.name, item.category);

    let contactSection = "";

    if (item.contact) {
        contactSection = `
            <li>
                <strong>Contact</strong>
                ${escapeText(item.contact)}
            </li>
        `;
    } else {
        contactSection = `
            <li>
                <strong>Contact</strong>
                Not provided
            </li>
        `;
    }

    document.getElementById("detailsContent").innerHTML = `
        <div class="detail-emoji">${emoji}</div>

        <span class="status ${item.type}">
            ${escapeText(item.type)} Item
        </span>

        <h3>${escapeText(item.name)}</h3>

        <p class="detail-description">
            ${escapeText(item.description)}
        </p>

        <ul class="detail-info">
            <li>
                <strong>Category</strong>
                ${escapeText(item.category)}
            </li>

            <li>
                <strong>Location</strong>
                ${escapeText(item.location)}
            </li>

            <li>
                <strong>Date</strong>
                ${formatDate(item.date)}
            </li>

            ${contactSection}
        </ul>

        <p class="form-note">
            Safety tip: verify ownership before returning an item.
            Arrange handovers in a public campus location.
        </p>

        <button class="primary-btn" onclick="closeDetails()">
            Close
        </button>
    `;

    document.getElementById("detailsModal").classList.remove("hidden");
}


function closeDetails() {
    document.getElementById("detailsModal").classList.add("hidden");
}


function showMyReports() {
    resetFilters();

    document.getElementById("listings").scrollIntoView({
        behavior: "smooth"
    });

    showToast("Showing reports saved in this browser.");
}


let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function() {
        toast.classList.remove("show");
    }, 2500);
}


document.getElementById("menuBtn").addEventListener(
    "click",
    function() {
        document.getElementById("navLinks").classList.toggle("open");
    }
);

document.querySelectorAll("#navLinks a").forEach(function(link) {
    link.addEventListener("click", function() {
        document.getElementById("navLinks").classList.remove("open");
    });
});


document.querySelectorAll(".modal").forEach(function(modal) {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });
});


document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeForm();
        closeDetails();
    }
});


renderItems();